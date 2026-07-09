import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, FileText, Heart } from "lucide-react";
import { ApiService } from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";

interface ContestDetailsData {
  category: {
    id: string;
    name: string;
    description: string;
  };
  exams: {
    id: string;
    name: string;
    year: string;
    institution: string;
    questionsCount: number;
  }[];
  totalQuestions: number;
  subjects: Record<string, number>;
}

export default function ContestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<ContestDetailsData | null>(null);
  const [outOfLivesModal, setOutOfLivesModal] = useState(false);

  const isFree = user?.planType === 'FREE';
  const remainingLives = isFree ? Math.max(0, 5 - (user?.dailyErrors || 0)) : null;

  useEffect(() => {
    async function loadDetails() {
      try {
        const response = await ApiService.get<any>(`/categories/${id}/details`);
        setData(response.data || response);
      } catch (error) {
        console.error("Erro ao carregar detalhes", error);
      }
    }
    loadDetails();
  }, [id]);

  if (!data) return <div className="p-8 text-center">Carregando detalhes...</div>;

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => navigate('/concursos')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#3b82f6] transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Concursos
      </button>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] mb-2">
            {data.category.name}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">{data.category.description}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-indigo-50 px-4 py-4 md:px-5 rounded-2xl text-center flex-1 md:min-w-[110px] border border-indigo-100">
            <span className="block text-2xl md:text-3xl font-extrabold text-indigo-600">{data.exams.length}</span>
            <span className="text-xs text-indigo-600 uppercase font-bold mt-1 block">Provas</span>
          </div>
          <div className="bg-emerald-50 px-4 py-4 md:px-5 rounded-2xl text-center flex-1 md:min-w-[110px] border border-emerald-100">
            <span className="block text-2xl md:text-3xl font-extrabold text-emerald-600">{data.totalQuestions}</span>
            <span className="text-xs text-emerald-600 uppercase font-bold mt-1 block">Questões</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Provas */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-[#1e293b] flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Provas Disponíveis
          </h2>
          <div className="space-y-4">
            {data.exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:shadow-md">
                <div className="w-full">
                  <h3 className="text-lg font-bold text-[#1e293b]">{exam.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {exam.year || "N/A"}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4"/> Banca: {exam.institution || "N/A"}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md text-xs font-semibold">{exam.questionsCount} questões</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (remainingLives === 0) {
                      setOutOfLivesModal(true);
                    } else {
                      navigate(`/prova/${exam.id}`);
                    }
                  }}
                  className="w-full md:w-auto whitespace-nowrap bg-[#1e293b] hover:bg-[#334155] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm mt-2 md:mt-0"
                >
                  Resolver Prova
                </button>
              </div>
            ))}
            {data.exams.length === 0 && (
              <p className="text-gray-500">Nenhuma prova cadastrada para este concurso ainda.</p>
            )}
          </div>
        </div>

        {/* Assuntos Mapeados */}
        <div>
          <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-400" />
            Matérias e Assuntos
          </h2>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            {Object.entries(data.subjects).length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma questão mapeada.</p>
            ) : (
              Object.entries(data.subjects).map(([subject, count]) => (
                <div key={subject} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{subject}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold text-xs">
                    {count} questões
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Acabou as Vidas */}
      {outOfLivesModal && (
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
              <button onClick={() => navigate('/premium')} className="w-full bg-gradient-to-r from-gold to-gold-hover text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-gold/20 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-0.5">
                Assinar Plano PRO
              </button>

              <button
                onClick={() => {
                  // Lógica futura de anúncio
                  setOutOfLivesModal(false);
                }}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-6 rounded-2xl transition-all"
              >
                Assistir anúncio (+1 vida)
              </button>

              <button
                onClick={() => setOutOfLivesModal(false)}
                className="w-full text-gray-400 hover:text-gray-600 font-bold py-3 mt-2 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
