import axios from 'axios';
import setupOfflineInterceptor from "../service/offlineInterceptor";
import { initSyncOnReconnect } from "../service/syncManager";

const api = axios.create({
  baseURL: 'https://api-kmtrack-final.vercel.app',
});

setupOfflineInterceptor(api);
initSyncOnReconnect();

export default api;