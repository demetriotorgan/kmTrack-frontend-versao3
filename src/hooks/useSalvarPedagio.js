import { useState } from "react";
import { dateToIso, isoToDateEdit } from "../util/time";
import api from "../api/api";

export function useSalvarPedagio({ setListarPedagios }) {
  
  const hojeISO = new Date().toISOString();

  const pedagioInicial = {
    local: "",
    valor: "",
    data: isoToDateEdit(hojeISO), // input date: YYYY-MM-DD
  };

  const [dadosPedagio, setDadosPedagio] = useState(pedagioInicial);
  const [salvando, setSalvando] = useState(false);

  const handleDadosPedagio = (e) => {
    const { name, value } = e.target;
    setDadosPedagio((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    const erros = [];

    if (!dadosPedagio.local.trim()) erros.push("Local");
    if (!dadosPedagio.valor.trim()) erros.push("Valor");
    if (!dadosPedagio.data.trim()) erros.push("Data");

    if (erros.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n" +
        erros.map((e) => `• ${e}`).join("\n")
      );
      return false;
    }

    return true;
  };

  const criarPayload = () => ({
    local: dadosPedagio.local,
    valor: Number(dadosPedagio.valor) || 0,
    data: dateToIso(dadosPedagio.data),
  });

  const salvarPedagio = async () => {
     console.log("🟦 [PAG] Iniciando fluxo salvarPedagio()");

    if (!validarCampos()) {
        console.log("❌ [PAG] Campos inválidos");
      return;
    }

    const confirmar = window.confirm("Deseja realmente salvar este pedágio?");
    if (!confirmar) return;

    try {
      setSalvando(true);

      const payload = criarPayload();
       console.log("📦 [PAG] Payload criado:", payload);

      const response = await api.post("/salvar-pedagio", payload);
        console.log("🌐 [PAG] Resposta da API:", response);

      // 🔹 ONLINE NORMAL — API respondeu com objeto criado
      if (!response.data.offline) {
           console.log("🟢 [PAG] Salvamento ONLINE concluído");
        setListarPedagios((prev) => [response.data.pedagio, ...prev]);
        alert("Pedágio salvo com sucesso!");
        setDadosPedagio(pedagioInicial);
        return;
      }

      // 🔹 CASO OFFLINE — offlineInterceptor cuidou do IndexedDB
      if (response.data.offline === true) {
         console.log("🟠 [PAG] Salvamento OFFLINE — interceptor gerenciou IDB");

        const pedagioOffline = {
          ...payload,
          _id: "temp-" + Date.now(),
          offline: true,
        };

        setListarPedagios((prev) => [pedagioOffline, ...prev]);

        alert(
          "Sem conexão! O registro foi salvo offline e será sincronizado automaticamente."
        );

        setDadosPedagio(pedagioInicial);
        return;
      }

    } catch (error) {
      console.log("❌ [PAG] Erro inesperado no try/catch:", error);
      console.log(error);
      alert("Erro ao salvar pedágio. Veja o console para mais detalhes.");
    } finally {
      setSalvando(false);
       console.log("🟨 [PAG] Salvamento finalizado");
    }
  };

  return {
    salvarPedagio,
    handleDadosPedagio,
    dadosPedagio,
    setDadosPedagio,
    salvando,
    pedagioInicial,
  };
}
