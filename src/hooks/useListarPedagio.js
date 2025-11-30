import { useEffect, useState } from "react";
import api from "../api/api";

export function useListarPedagio() {
    const [listarPedagios, setListarPedagios] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const carregarPedagios = async()=>{
  try {
    const response = await api.get('/listar-pedagio');
    setListarPedagios(response.data);
    // console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

useEffect(()=>{
  carregarPedagios();
},[]);

    return {
        listarPedagios,
       setListarPedagios,
       carregando,
       carregarPedagios
    }
}