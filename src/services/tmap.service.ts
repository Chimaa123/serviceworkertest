import axios from "axios";

export const tmaphttp = axios.create({
  baseURL: "https://apis.openapi.sk.com/tmap",
  headers: {
    appKey: process.env.REACT_APP_TMAP_KEY,
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

export const routeOptimization = (data: any, headers?: any) =>
  tmaphttp.post("/routes/routeOptimization30?version=1&format=json", data, {
    headers,
  });
