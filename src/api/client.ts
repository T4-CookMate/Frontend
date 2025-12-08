// src/api/client.ts
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // 쿠키/세션 쓰면 true, 아니면 빼도 됨
});

