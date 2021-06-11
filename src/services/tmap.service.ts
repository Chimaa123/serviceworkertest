import axios from "axios";
import {
  TMapRouteApiData,
  TMapRouteOptimizationApiData,
  TMapRouteResponse,
} from "../types/tmap.types";

export const tmaphttp = axios.create({
  baseURL: "https://apis.openapi.sk.com/tmap",
  headers: {
    appKey: process.env.REACT_APP_TMAP_KEY,
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

export const getRoutewithVia = (data: TMapRouteOptimizationApiData) =>
  tmaphttp.post("/routes/routeOptimization30?version=1&format=json", data, {});

export const getRoute = (data: TMapRouteApiData): Promise<TMapRouteResponse> =>
  tmaphttp.post("/routes?version=1&format=json&callback=result", {
    ...data,
    appKey: process.env.REACT_APP_TMAP_KEY,
  });
