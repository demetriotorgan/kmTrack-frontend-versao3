import { idbService } from "../service/idbService";

export const STORES = {
  TRECHO: "trechosPendentes",
  PARADA: "paradasPendentes",
  PEDAGIO: "pedagiosPendentes",
  ABASTECIMENTO: "abastecimentosPendentes",
};

export const ROUTE_TO_STORE = [
  // ✅ ADICIONAR TRECHO
  { route: "/salvar-trecho", store: STORES.TRECHO },
  { route: "/editar-trecho", store: STORES.TRECHO },
  { route: "/deletar-trecho", store: STORES.TRECHO },
  
  // ✅ ADICIONAR PEDÁGIO
  { route: "/salvar-pedagio", store: STORES.PEDAGIO },
  { route: "/listar-pedagio", store: STORES.PEDAGIO },
  { route: "/deletar-pedagio", store: STORES.PEDAGIO },
  
];

function identifyStore(url) {
  const clean = url.replace(window.location.origin, "");
  const match = ROUTE_TO_STORE.find((item) => clean.includes(item.route));
  return match?.store ?? null;
}

export default function setupOfflineInterceptor(api) {
  api.interceptors.request.use(
    async (config) => {
      const isMutation = ["post", "put", "delete"].includes(config.method);
      if (navigator.onLine || !isMutation) return config;

      const store = identifyStore(config.url);
      if (!store) return config;

      const payload = {
        idTemp: crypto.randomUUID(),
        method: config.method,
        endpoint: config.url.replace(window.location.origin, ""),
        body: config.data ?? null,
        timestamp: new Date().toISOString(),
      };

      await idbService.saveItem(store, payload);

      console.log("💾 Registrado offline:", payload);

      return Promise.reject({
        message: "offline",
        offlineStored: true,
      });
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.offlineStored) {
        return Promise.resolve({ data: { offline: true } });
      }
      return Promise.reject(error);
    }
  );
}
