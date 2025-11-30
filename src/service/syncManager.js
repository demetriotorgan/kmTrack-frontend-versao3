import axios from "axios";
import { idbService } from "../service/idbService";
import { STORES } from "../service/offlineInterceptor";
import api from "../api/api"; // BASEURL aqui!!!

async function syncStore(storeName) {
  try {
    const pendentes = await idbService.listItems(storeName);

    if (!pendentes.length) {
      console.log(`⚪ [SYNC] Nenhum item em ${storeName}`);
      return;
    }

    for (const item of pendentes) {
      try {
        await axios({
          method: item.method,
          url: api.defaults.baseURL + item.endpoint,
          data: item.body,
        });

        await idbService.removeItem(storeName, item.idTemp);

        console.log(`✔ [SYNC] Enviado → ${item.endpoint}`);
      } catch {
        console.warn(`❌ [SYNC] Falha ao sincronizar ${item.endpoint}`);
      }
    }
  } catch {
    console.error(`❌ [SYNC] Store não existe: ${storeName}`);
  }
}

export async function syncAll() {
  console.log("🔄 Iniciando sincronização geral...");

  for (const storeName of Object.values(STORES)) {
    await syncStore(storeName);
  }

  console.log("✨ Sincronização concluída.");
}

export function initSyncOnReconnect() {
  window.addEventListener("online", () => {
    console.log("🌐 Conexão restaurada — iniciando sync...");
    syncAll();
  });
}
