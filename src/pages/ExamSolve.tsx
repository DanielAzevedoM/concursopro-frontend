import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Heart } from "lucide-react";
import { ApiService } from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";
import AlertModal from "../components/AlertModal";
import type { AlertType } from "../components/AlertModal";

interface QuestionItem {
  id: string;
  text: string;
  subject?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  optionF?: string;
  type: string;
}

interface QuestionScope {
  id: string;
  text: string;
  imageUrl?: string;
  questions: QuestionItem[];
}

interface AnswerResponse {
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
  remainingLives: number;
  message: string;
}

export default function ExamSolve() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [questionScopes, setQuestionScopes] = useState<QuestionScope[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mapeia qual opção o usuário escolheu em cada questão
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [groupAnswers, setGroupAnswers] = useState<Record<string, AnswerResponse>>({});
  const [answering, setAnswering] = useState<string | null>(null);
  const [outOfLives, setOutOfLives] = useState(false);

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const isFree = user?.planType === "FREE";
  const [localLives, setLocalLives] = useState<number | null>(null);

  useEffect(() => {
    if (user && localLives === null) {
      setLocalLives(isFree ? Math.max(0, 5 - (user.dailyErrors || 0)) : 999);
    }
  }, [user, localLives, isFree]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await ApiService.get<any>(`/questions/exam/${id}`);
        const data = response.data || response;
        // Embaralha os grupos, mantendo as questões agrupadas internamente na sua ordem
        const shuffledScopes = data.sort(() => 0.5 - Math.random());
        setQuestionScopes(shuffledScopes);
      } catch (error) {
        console.error("Erro ao carregar questões da prova", error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [id]);

  const currentScope = questionScopes[currentIndex];

  const handleOptionSelect = async (questionId: string, optionKey: string) => {
    if (selectedOptions[questionId] || answering || outOfLives || localLives === 0) return;

    if (isFree && localLives !== null && localLives <= 0) {
      setOutOfLives(true);
      return;
    }

    setSelectedOptions(prev => ({ ...prev, [questionId]: optionKey }));
    setAnswering(questionId);

    try {
      const response = await ApiService.post<any>("/questions/answer", {
        questionId: questionId,
        selectedOption: optionKey,
      });
      const data = response.data || response;
      setGroupAnswers(prev => ({ ...prev, [questionId]: data }));

      if (data.remainingLives !== -1) {
        setLocalLives(data.remainingLives);
        updateUser({ dailyErrors: Math.max(0, 5 - data.remainingLives) });
        if (data.remainingLives <= 0) {
          setOutOfLives(true);
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes("limite")) {
        setOutOfLives(true);
      }
    } finally {
      setAnswering(null);
    }
  };

  const handleNext = () => {
    setSelectedOptions({});
    setGroupAnswers({});
    if (currentIndex < questionScopes.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setAlertModal({
        isOpen: true,
        type: "success",
        title: "Prova Finalizada!",
        message: "Você finalizou todas as questões desta prova com sucesso.",
        confirmText: "Voltar",
        onConfirm: () => {
          setAlertModal(prev => ({ ...prev, isOpen: false }));
          navigate(-1);
        },
      });
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando prova...</div>;
  if (questionScopes.length === 0) return <div className="p-8 text-center">Nenhuma questão encontrada para esta prova.</div>;

  // Calcula o índice da primeira questão não respondida do escopo atual
  const activeQuestionIndex = currentScope.questions.findIndex(q => !groupAnswers[q.id]);
  const isGroupFinished = activeQuestionIndex === -1;

  return (
    <div className="pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Sair da Prova
        </button>
        <div className="flex items-center gap-4">
          {localLives !== null && localLives !== 999 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-bold text-sm border border-red-100">
              <Heart className="w-4 h-4 fill-current" />
              {localLives}
            </div>
          )}
          <div className="text-sm font-bold text-gray-400">
            Grupo {currentIndex + 1} de {questionScopes.length}
          </div>
        </div>
      </div>

      {outOfLives && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Vidas Esgotadas!</h2>
          <p className="text-red-500 mb-4">Você atingiu o limite de 5 erros diários no plano gratuito.</p>
          <button onClick={() => navigate('/premium')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Assinar PRO para Vidas Infinitas
          </button>
        </div>
      )}

      {/* Base Text Card if exists */}
      {currentScope.text && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-6 shadow-sm">
          <div className="mb-4">
            <span className="inline-block bg-slate-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Texto de Referência
            </span>
          </div>
          <p className="text-[#1e293b] whitespace-pre-wrap text-lg font-medium leading-relaxed">
            {currentScope.text}
          </p>
          {currentScope.imageUrl && (
            <img src={currentScope.imageUrl} alt="Referência" className="mt-4 rounded-lg max-w-full border border-gray-200 shadow-sm" />
          )}
        </div>
      )}

      {/* Render Questions in Group */}
      {currentScope.questions.map((q, index) => {
        const isActive = index === activeQuestionIndex;
        const answerResult = groupAnswers[q.id];
        const isAnswered = !!answerResult;
        const isFuture = index > activeQuestionIndex && activeQuestionIndex !== -1;

        // Disabled se for uma questão futura (sequencial), se já tiver sido respondida, se perdeu vidas, ou se outra tá carregando
        const isDisabled = isFuture || isAnswered || outOfLives || answering !== null;

        const options = q.type === "RIGHT_WRONG"
          ? [
            { key: "C", text: "Certo" },
            { key: "E", text: "Errado" },
          ]
          : [
            { key: "A", text: q.optionA },
            { key: "B", text: q.optionB },
            { key: "C", text: q.optionC },
            { key: "D", text: q.optionD },
            { key: "E", text: q.optionE },
            { key: "F", text: q.optionF },
          ].filter((o): o is { key: string, text: string } => !!o.text);

        return (
          <div key={q.id} className={`bg-white rounded-xl border transition-all duration-300 shadow-sm overflow-hidden mb-6 ${isActive ? 'ring-2 ring-primary-800 border-primary-800 shadow-md' : 'border-gray-100'} ${isFuture ? 'opacity-60 grayscale-[50%]' : ''}`}>
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block bg-slate-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
                  Questão
                </span>
                {isFuture && (
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    Bloqueada
                  </span>
                )}
              </div>

              <p className="text-[15px] text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                {q.text}
              </p>

              <div className="space-y-3">
                {options.map((opt) => {
                  const isSelected = selectedOptions[q.id] === opt.key;
                  let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ";

                  if (!answerResult) {
                    btnClass += isSelected
                      ? "border-primary-800 bg-slate-50 ring-2 ring-primary-800/20"
                      : isDisabled ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed" : "border-gray-200 hover:border-primary-800/30 hover:bg-gray-50 cursor-pointer";
                  } else {
                    if (opt.key === answerResult.correctOption) {
                      btnClass += "border-emerald-500 bg-emerald-50";
                    } else if (isSelected && !answerResult.isCorrect) {
                      btnClass += "border-red-500 bg-red-50";
                    } else {
                      btnClass += "border-gray-100 opacity-50 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={isDisabled}
                      onClick={() => handleOptionSelect(q.id, opt.key)}
                      className={btnClass}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5
                        ${answerResult && opt.key === answerResult.correctOption ? 'border-emerald-500 text-emerald-500 bg-emerald-100' : ''}
                        ${answerResult && !answerResult.isCorrect && isSelected && opt.key !== answerResult.correctOption ? 'border-red-500 text-red-500 bg-red-100' : ''}
                        ${!answerResult ? (isDisabled && !isSelected ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-500') : ''}
                      `}>
                        {opt.key}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resultado Footer Individual */}
            {answerResult && (
              <div className={`p-4 md:px-8 border-t flex flex-col sm:flex-row items-center gap-4 ${answerResult.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                {answerResult.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <h3 className={`font-bold ${answerResult.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {answerResult.isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta!'}
                  </h3>
                  {!answerResult.isCorrect && isFree && (
                    <p className="text-sm text-red-600 font-medium">Você perdeu 1 vida. (Restam {answerResult.remainingLives})</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Footer "Avançar" só aparece quando terminar o grupo */}
      {isGroupFinished && (
        <div className="flex justify-end mt-4 mb-10">
          <button
            onClick={handleNext}
            className="font-bold px-10 py-3.5 rounded-xl transition-colors bg-primary-800 hover:bg-primary-900 text-white shadow-lg shadow-slate-200"
          >
            Avançar para Próxima Etapa
          </button>
        </div>
      )}

      {/* Modal Acabou as Vidas */}
      {outOfLives && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="w-10 h-10 text-red-500 fill-current animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-3">Vidas esgotadas!</h2>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
              Você atingiu o limite de erros diários do plano gratuito. Continue estudando sem limites assinando o <span className="text-gold-hover font-bold">Plano PRO</span> ou ganhe uma vida extra agora.
            </p>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-gold to-gold-hover text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-gold/20 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-0.5">
                Assinar Plano PRO
              </button>

              <button
                onClick={() => setAlertModal({
                  isOpen: true,
                  type: "info",
                  title: "Anúncio",
                  message: "Exibindo anúncio... (Lógica futura)",
                  confirmText: "OK",
                  onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false }))
                })}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-6 rounded-2xl transition-all"
              >
                Assistir anúncio (+1 vida)
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full text-gray-400 hover:text-gray-600 font-bold py-3 mt-2 transition-colors"
              >
                Sair da Prova
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal {...alertModal} />
    </div>
  );
}
