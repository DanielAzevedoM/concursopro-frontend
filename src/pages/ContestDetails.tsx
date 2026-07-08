import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import { ApiService } from "../services/ApiService";

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
  const [data, setData] = useState<ContestDetailsData | null>(null);

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

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] mb-2">
            {data.category.name}
          </h1>
          <p className="text-gray-500">{data.category.description}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-indigo-50 px-5 py-4 rounded-2xl text-center min-w-[110px] border border-indigo-100">
            <span className="block text-3xl font-extrabold text-indigo-600">{data.exams.length}</span>
            <span className="text-xs text-indigo-600 uppercase font-bold mt-1 block">Provas</span>
          </div>
          <div className="bg-emerald-50 px-5 py-4 rounded-2xl text-center min-w-[110px] border border-emerald-100">
            <span className="block text-3xl font-extrabold text-emerald-600">{data.totalQuestions}</span>
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
              <div key={exam.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-indigo-200 transition-all flex items-center justify-between hover:shadow-md">
                <div>
                  <h3 className="text-lg font-bold text-[#1e293b]">{exam.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {exam.year || "N/A"}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4"/> Banca: {exam.institution || "N/A"}</span>
                    <span>{exam.questionsCount} questões</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/prova/${exam.id}`)}
                  className="bg-[#1e293b] hover:bg-[#334155] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
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
    </div>
  );
}
