import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Shield, Landmark, Scale, GraduationCap, Building, Stethoscope, CheckCircle, Trash2, Lock } from "lucide-react";
import { ApiService } from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";
import AlertModal, { type AlertType } from "../components/AlertModal";

interface Contest {
  id: string;
  name: string;
  description: string;
  examsCount: number;
  questionsCount: number;
  isEnrolled: boolean;
  enrolledAt: string | null;
}

export default function Contests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const loadContests = async () => {
    try {
      const response = await ApiService.get<any>("/categories");
      setContests(response.data || response);
    } catch (error) {
      console.error("Erro ao carregar concursos", error);
    }
  };

  useEffect(() => {
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

  const handleEnroll = async (contestId: string) => {
    setAlertModal({
      isOpen: true,
      type: "info",
      title: "Confirmação",
      message: "Deseja se cadastrar neste concurso? (Aviso: O descadastro só poderá ser feito após 15 dias)",
      confirmText: "Sim, cadastrar",
      cancelText: "Cancelar",
      onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
      onConfirm: async () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        try {
          await ApiService.post(`/categories/${contestId}/enroll`);
          setAlertModal({
            isOpen: true,
            type: "success",
            title: "Sucesso",
            message: "Cadastrado com sucesso!",
            confirmText: "OK",
            onConfirm: () => {
              setAlertModal(prev => ({ ...prev, isOpen: false }));
              loadContests();
            }
          });
        } catch (error: any) {
          const msg = error.response?.data?.message || error.message || "Ocorreu um erro ao cadastrar.";
          setAlertModal({
            isOpen: true,
            type: "error",
            title: "Erro",
            message: msg,
            confirmText: "OK",
            onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  const handleUnenroll = async (contestId: string) => {
    setAlertModal({
      isOpen: true,
      type: "warning",
      title: "Atenção",
      message: "Tem certeza que deseja remover este concurso dos seus cadastros?",
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
      onConfirm: async () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        try {
          await ApiService.delete(`/categories/${contestId}/enroll`);
          setAlertModal({
            isOpen: true,
            type: "success",
            title: "Sucesso",
            message: "Descadastrado com sucesso!",
            confirmText: "OK",
            onConfirm: () => {
              setAlertModal(prev => ({ ...prev, isOpen: false }));
              loadContests();
            }
          });
        } catch (error: any) {
          const msg = error.response?.data?.message || error.message || "Ocorreu um erro ao remover.";
          setAlertModal({
            isOpen: true,
            type: "error",
            title: "Erro",
            message: msg,
            confirmText: "OK",
            onConfirm: () => setAlertModal(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  const filteredContests = contests.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrolledContests = filteredContests
    .filter(c => c.isEnrolled)
    .sort((a, b) => {
      if (!a.enrolledAt) return 1;
      if (!b.enrolledAt) return -1;
      return new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime();
    });
  const availableContests = filteredContests.filter(c => !c.isEnrolled);

  const isFree = user?.planType === "FREE";
  const isQuotaReached = isFree && enrolledContests.length >= 2;

  const renderCard = (contest: Contest, type: "ENROLLED" | "AVAILABLE", index?: number) => {
    const isAvailableDisabled = type === "AVAILABLE" && isQuotaReached;
    const isEnrolledDisabled = type === "ENROLLED" && isFree && index !== undefined && index >= 2;
    const isDisabled = isAvailableDisabled || isEnrolledDisabled;

    return (
      <div
        key={contest.id}
        className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all relative flex flex-col ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:-translate-y-1"
          }`}
      >
        {contest.name === "PRF" && (
          <div className="absolute top-0 right-6 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-sm">
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
          {type === "ENROLLED" && contest.enrolledAt && (
            <p className="text-xs text-gray-400 mt-2">
              Cadastrado em {new Date(contest.enrolledAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {type === "ENROLLED" ? (
            <>
              <button
                onClick={() => navigate(`/concursos/${contest.id}`)}
                disabled={isDisabled}
                className={`w-full font-semibold py-3 rounded-xl transition-colors ${isDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#1e293b] hover:bg-[#334155] text-white"
                  }`}
              >
                {isDisabled ? (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Exclusivo PRO
                  </span>
                ) : (
                  "Ver Provas"
                )}
              </button>
              <button
                onClick={() => handleUnenroll(contest.id)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Remover
              </button>
            </>
          ) : (
            <button
              onClick={() => handleEnroll(contest.id)}
              disabled={isDisabled}
              className={`w-full font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${isDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
            >
              {isDisabled ? <Lock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              {isDisabled ? "Limite Atingido" : "Cadastrar-se"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-10 max-w-7xl mx-auto space-y-10">
      <AlertModal {...alertModal} />
      {/* Header e Busca */}
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1e293b] mb-1">
            Disciplinas & Concursos
          </h1>
          <p className="text-gray-500 text-sm">
            Cadastre-se nos concursos que deseja focar para acessar as provas.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:border-transparent transition-shadow"
              placeholder="Buscar concurso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filtro
          </button>
        </div>
      </div>

      {/* Cadastrados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#1e293b]">Meus Cadastros</h2>
          {isFree && (
            <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
              {enrolledContests.length} / 2 Cadastros Gratuitos
            </span>
          )}
        </div>

        {enrolledContests.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <p className="text-gray-500 font-medium">Você ainda não está cadastrado em nenhum concurso.</p>
            <p className="text-sm text-gray-400 mt-1">Escolha um concurso disponível abaixo e clique em Cadastrar-se.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledContests.map((c, index) => renderCard(c, "ENROLLED", index))}
          </div>
        )}
      </div>

      {/* Disponíveis */}
      <div>
        <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Concursos Disponíveis</h2>
        {availableContests.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum concurso novo disponível.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableContests.map(c => renderCard(c, "AVAILABLE"))}
          </div>
        )}
      </div>

    </div>
  );
}
