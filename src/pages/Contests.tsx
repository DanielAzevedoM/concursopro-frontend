import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Shield, Landmark, Scale, GraduationCap, Building, Stethoscope } from "lucide-react";
import { ApiService } from "../services/ApiService";

interface Contest {
  id: string;
  name: string;
  description: string;
  examsCount: number;
  questionsCount: number;
}

export default function Contests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadContests() {
      try {
        const data = await ApiService.get<Contest[]>("/categories");
        setContests(data);
      } catch (error) {
        console.error("Erro ao carregar concursos", error);
      }
    }
    loadContests();
  }, []);

  const getIconForContest = (name: string) => {
    const iconClass = "w-10 h-10 text-slate-700";
    if (name.includes("PRF")) return <Shield className={iconClass} />;
    if (name.includes("SEFAZ")) return <Landmark className={iconClass} />;
    if (name.includes("TRF")) return <Scale className={iconClass} />;
    if (name.includes("MEC")) return <GraduationCap className={iconClass} />;
    if (name.includes("Receita")) return <Building className={iconClass} />;
    if (name.includes("ANVISA")) return <Stethoscope className={iconClass} />;
    return <Building className={iconClass} />;
  };

  const filteredContests = contests.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-1">
          Selecione o Concurso
        </h1>
        <p className="text-gray-500 text-sm">
          Escolha uma categoria e comece a responder.
        </p>
      </div>

      {/* Busca e Filtro */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtro
        </button>
      </div>

      {/* Grid de Concursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((contest) => (
          <div
            key={contest.id}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
          >
            {contest.name === "PRF" && (
              <div className="absolute top-0 right-6 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-b-md">
                CP
              </div>
            )}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-slate-50 rounded-lg">
                {getIconForContest(contest.name)}
              </div>
              <h3 className="text-xl font-bold text-[#1e293b]">{contest.name}</h3>
            </div>

            <div className="space-y-1 mb-6 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Provas anteriores:</span>{" "}
                {contest.examsCount}
              </p>
              <p>
                <span className="font-medium text-gray-900">Questões disponíveis:</span>{" "}
                {contest.questionsCount}
              </p>
            </div>

            <button
              onClick={() => navigate(`/concursos/${contest.id}`)}
              className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Ver Provas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
