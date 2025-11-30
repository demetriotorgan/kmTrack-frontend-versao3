// service/idbService.js

let db = null;
const DB_NAME = "travelAppDB";
const DB_VERSION = 3;

// Todas as stores usadas no app devem existir aqui
export const STORES_CONFIG = [
  { name: "trechosPendentes", keyPath: "idTemp" },
  { name: "paradasPendentes", keyPath: "idTemp" },
  { name: "pedagiosPendentes", keyPath: "idTemp" },
  { name: "abastecimentosPendentes", keyPath: "idTemp" },
];

export function initDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject("Erro ao abrir o banco");

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      STORES_CONFIG.forEach((cfg) => {
        if (!db.objectStoreNames.contains(cfg.name)) {
          db.createObjectStore(cfg.name, { keyPath: cfg.keyPath });
        }
      });

      console.log("📦 Stores criadas/atualizadas");
    };
  });
}

export async function saveItem(storeName, data) {
  await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readwrite");
    const store = tx.objectStore(storeName);

    if (!data.idTemp) data.idTemp = crypto.randomUUID();

    store.put(data);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Erro ao salvar");
  });
}

export async function listItems(storeName) {
  await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readonly");
    const store = tx.objectStore(storeName);

    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject("Erro ao listar");
  });
}

export async function removeItem(storeName, id) {
  await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], "readwrite");
    tx.objectStore(storeName).delete(id);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Erro ao remover");
  });
}

export const idbService = { initDB, saveItem, listItems, removeItem };
