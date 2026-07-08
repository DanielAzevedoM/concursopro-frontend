import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { ApiService } from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";

interface Question {
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
  const { user } = useAuth(); // We can re-fetch /me by calling a context method, but let's just do it directly if needed

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [answering, setAnswering] = useState(false);
  const [outOfLives, setOutOfLives] = useState(false);

  // Sync lives by forcing a page reload of user data from the backend? We can just let the Dashboard handle it, 
  // but if we are here we should block.
  const isFree = user?.planType === "FREE";
  const currentLives = isFree ? Math.max(0, 5 - (user?.dailyErrors || 0)) : 999;

  useEffect(() => {
    async function loadQuestions() {
      try {
        const { data } = await ApiService.get<{ data: Question[] }>(`/questions/exam/${id}`);
        // Embaralhar as questões aleatoriamente
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
      } catch (error) {
        console.error("Erro ao carregar questões da prova", error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [id]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = async (optionKey: string) => {
    if (selectedOption || answering || outOfLives || currentLives === 0) return;

    if (isFree && currentLives <= 0) {
      setOutOfLives(true);
      return;
    }

    setSelectedOption(optionKey);
    setAnswering(true);

    try {
      const data = await ApiService.post<AnswerResponse>("/questions/answer", {
        questionId: currentQuestion.id,
        selectedOption: optionKey,
      });
      setAnswerResult(data);

      if (data.remainingLives !== -1 && data.remainingLives <= 0) {
        setOutOfLives(true);
      }

      // Mudar a lógica para que o AuthContext recarregue os dados via refresh ou o usuário tenha que sair da tela
      // O ideal seria que o useAuth provesse uma forma de dar reload no /me

    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes("limite")) {
        setOutOfLives(true);
      }
    } finally {
      setAnswering(false);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setAnswerResult(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      // Prova acabou
      alert("Você finalizou as questões desta prova!");
      navigate(-1);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando prova...</div>;
  if (questions.length === 0) return <div className="p-8 text-center">Nenhuma questão encontrada para esta prova.</div>;

  const options = currentQuestion.type === "RIGHT_WRONG"
    ? [
        { key: "C", text: "Certo" },
        { key: "E", text: "Errado" },
      ]
    : [
        { key: "A", text: currentQuestion.optionA },
        { key: "B", text: currentQuestion.optionB },
        { key: "C", text: currentQuestion.optionC },
        { key: "D", text: currentQuestion.optionD },
        { key: "E", text: currentQuestion.optionE },
        { key: "F", text: currentQuestion.optionF },
      ].filter(o => o.text);

  return (
    <div className="pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#3b82f6] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Sair da Prova
        </button>
        <div className="text-sm font-bold text-gray-400">
          Questão {currentIndex + 1} de {questions.length}
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

      {/* Questão Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          {currentQuestion.subject && (
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {currentQuestion.subject}
            </span>
          )}

          <p className="text-lg text-[#1e293b] leading-relaxed mb-8">
            {currentQuestion.text}
          </p>

          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ";

              if (!answerResult) {
                // Estado normal ou hover
                btnClass += isSelected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50";
              } else {
                // Mostrando resultado (verde ou vermelho)
                if (opt.key === answerResult.correctOption) {
                  // A correta sempre fica verde
                  btnClass += "border-emerald-500 bg-emerald-50";
                } else if (isSelected && !answerResult.isCorrect) {
                  // Se selecionou errado, fica vermelha
                  btnClass += "border-red-500 bg-red-50";
                } else {
                  // As outras ficam desabilitadas/opacas
                  btnClass += "border-gray-200 opacity-50";
                }
              }

              return (
                <button
                  key={opt.key}
                  disabled={!!answerResult || outOfLives || answering}
                  onClick={() => handleOptionSelect(opt.key)}
                  className={btnClass}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5
                    ${answerResult && opt.key === answerResult.correctOption ? 'border-emerald-500 text-emerald-500 bg-emerald-100' : ''}
                    ${answerResult && !answerResult.isCorrect && isSelected && opt.key !== answerResult.correctOption ? 'border-red-500 text-red-500 bg-red-100' : ''}
                    ${!answerResult ? 'border-gray-300 text-gray-500' : ''}
                  `}>
                    {opt.key}
                  </div>
                  <span className="text-gray-700 leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resultado Footer */}
        {answerResult && (
          <div className={`p-6 md:px-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${answerResult.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-center gap-3">
              {answerResult.isCorrect ? (
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
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

            <button
              onClick={handleNext}
              className={`font-bold px-8 py-3 rounded-lg transition-colors w-full sm:w-auto
                ${answerResult.isCorrect
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
            >
              Avançar
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
