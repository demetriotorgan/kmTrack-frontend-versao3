import React, { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import DbStatus from "./DbStatus";

const StatusConexao = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: online ? "#19c37d" : "#d9534f",
        color: "white",
        fontWeight: "bold",
        gap: "8px",
        transition: "0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 9999,
      }}
    >
      {online ? (
        <>
          <Wifi size={18} />
          Conectado
        </>
      ) : (
        <>
          <WifiOff size={18} />
          Sem conexão — funcionando offline          
        </>
      )}
      {online ? (<DbStatus />) : ''}
    </div>
  );
};

export default StatusConexao;
