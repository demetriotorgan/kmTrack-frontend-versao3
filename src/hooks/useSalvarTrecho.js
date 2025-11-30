import { useState } from "react";
import { dateToIso, hhmmToIso } from "../util/time";
import api from "../api/api";

export function useSalvarTrecho(){
const trechoInicial = {
    nomeTrecho: "",
    distancia: "",
    inicio: "",
    fim: "",
    data: "",
}
const [dadosTrecho, setDadosTrecho] = useState(trechoInicial);
const [salvando, setSalvando] = useState(false);

const handleDadosTrecho =(e)=>{
  const {name, value} = e.target;
  setDadosTrecho((prev)=>({...prev,[name]:value}));
}

const criarPayload = () => ({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: Number(dadosTrecho.distancia) || 0,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data),
  });

    const salvarTrecho = async()=>{
    const confirmar = window.confirm('Deseja realmente salvar este trecho?');
    if(!confirmar) return

    try {
    setSalvando(true);
      const response = await api.post('/salvar-trecho', criarPayload());
      console.log(response.data);
      alert('Registro salvo com sucesso');
      setDadosTrecho(trechoInicial);
    } catch (error) {
      console.log(error);
    }finally{
        setSalvando(false);
    }    
        
    };

    return {
        dadosTrecho,
        setDadosTrecho,
        handleDadosTrecho,
        salvarTrecho,
        salvando
    };
}