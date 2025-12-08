// src/api/test.ts
import { api } from "./client";

export const pingServer = async () => {
    const res = await api.get("/recipes/search");
    return res.data;
};
