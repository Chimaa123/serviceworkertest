export type TMapRouteApiData = {
  appKey?: string;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  reqCoordType: "WGS84GEO" | "EPSG3857";
  resCoordType: "WGS84GEO" | "EPSG3857";
  searchOption: number;
  trafficInfo: "Y" | "N";
};

export type TmapFeatureData = {
  type: "Feature";
  geometry: {
    traffic: any;
    coordinates: number[][];
    type: "Point" | "LineString";
  };
  properties: {
    description: string;
    index: number;
    name: string;
    nextRoadName: string;
    pointIndex: number;
    pointType: string;
    taxiFare: number;
    totalDistance: number;
    totalFare: number;
    totalTime: number;
    turnType: number;
  };
};

export type TMapRouteResponse = {
  data: {
    features: TmapFeatureData[];
  };
};

export type ViaObject = {
  viaPointId: string;
  viaPointName: string;
  viaX: string;
  viaY: string;
};

export type TMapRouteOptimizationApiData = {
  startName: string;
  startX: string;
  startY: string;
  startTime: string; //출발 시간(YYYYMMDDHHMM)
  endName: string; //목적지 명칭
  //목적지 위경도 좌표입니다.
  endX: string;
  endY: string;
  //경유지 목록 입니다.
  //목록 전체는 대괄호[] 각각의 리스트는 중괄호{}로 묶습니다.
  viaPoints: ViaObject[];
  reqCoordType: string;
  resCoordType: string;
  searchOption: 0; //경로 탐색 옵션 입니다.
};
