import React, { useEffect, useRef, useState } from "react";
import {
  getCurrentPosition,
  watchLocation,
} from "../services/location.service";
import { Button, Image } from "antd";
import { getRoute, getRoutewithVia } from "../services/tmap.service";
import hubImage from "../assets/images/hub.map.png";
import startSvg from "../assets/svgs/start.map.svg";
import destinationSvg from "../assets/svgs/destination.map.svg";
import myLocationSvg from "../assets/svgs/mylocation.map.svg";
import btnMyLocationSvg from "../assets/svgs/btn_mylocation.map.svg";
import vias from "../assets/svgs/vias.map";
import "../design/ css/tmap.style.css";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

const destionations = require("../datas/destinatons.data.json");
const hubs = require("../datas/hubs.data.json");
const TMapComponent = () => {
  const mapRef = useRef<any>();
  let marker_d: any, marker_p: any;
  let chktraffic: any[] = [];
  let drawInfoArr: any[] = [];
  let resultMarkerArr: any[] = [];
  let resultdrawArr: any[] = [];
  let markerList: any[] = [];
  const [currentPosition, setCurrentPosition] = useState<any>(null);

  useEffect(() => {
    watchLocation(onLocationRetrieved);
    initTmap();
  }, []);

  function initTmap() {
    mapRef.current = new window.Tmapv2.Map("TMapApp", {
      center: new window.Tmapv2.LatLng(37.566481622437934, 126.98502302169841),
      httpsMode: true,
      width: "100%",
      height: "100%",
      zoom: 15,
    });

    drawHubs();
    drawDestinations();
  }

  function onLocationRetrieved(
    position: GeolocationPosition | null,
    setCenter?: boolean
  ) {
    let lat = 37.56445848334345; // 위도
    let lon = 127.00973587385866; // 경도
    setCurrentPosition({ coords: { latitude: lat, longitude: lon } });
    // let lat = position.coords.latitude; // 위도
    // let lon = position.coords.longitude; // 경도
    addMarker("llMine", lon, lat, 0, setCenter);
  }

  function drawHubs() {
    hubs.map((dest: any, index: number) => {
      addMarker("llHub", dest.viaX, dest.viaY, index);
    });
  }

  function setCenter(lat?: number, lon?: number) {
    const map = mapRef.current;
    if (lon && lat && map) {
      console.log("map setCenter", lat, lon);
      map.setCenter(new window.Tmapv2.LatLng(lat, lon));
      map.setZoom(1);
    }
  }

  function drawDestinations() {
    destionations.map((dest: any, index: number) => {
      addMarker("llPass", dest.viaX, dest.viaY, index);
    });
  }

  function drawPath(response: any) {
    console.log("drawtest 1", response);
    var resultData = response.data.features;
    drawInfoArr = [];
    var lineYn = false;

    //그리기
    //for문 [S]
    for (var i in resultData) {
      console.log("drawPath for", i, lineYn);
      var geometry = resultData[i].geometry;
      var properties = resultData[i].properties;

      console.log("drawPath for", i, lineYn);
      if (geometry.type == "LineString") {
        for (var j in geometry.coordinates) {
          // 경로들의 결과값들을 포인트 객체로 변환
          var convertChange = new window.Tmapv2.LatLng(
            geometry.coordinates[j][1],
            geometry.coordinates[j][0]
          );
          // 배열에 담기
          console.log("drawPath LineString", i, j, lineYn);
          if (lineYn) {
            drawInfoArr.push(convertChange);
          }
        }
        console.log("drawLine", i, geometry.coordinates.length);
        drawLine(drawInfoArr);
      } else {
        if (
          properties.pointType == "S" ||
          properties.pointType == "E" ||
          properties.pointType == "N"
        ) {
          lineYn = true;
        } else {
          lineYn = false;
        }

        var markerType: any = "llPass";

        if (properties.pointType == "S") {
          markerType = "llStart";
        } else if (properties.pointType == "E") {
          markerType = "llEnd";
        } else {
          //각 포인트 마커
          markerType = "llPoint";
        }
        addMarker(
          markerType,
          geometry.coordinates[0],
          geometry.coordinates[1],
          0,
          false
        );
      }
    } //for문 [E]
  }

  function drawLine(arrPoint: any[]) {
    var polyline_;
    console.log("drawLine", arrPoint);
    polyline_ = new window.Tmapv2.Polyline({
      path: arrPoint,
      strokeColor: "#85B6FF",
      strokeWeight: 10,
      map: mapRef.current,
    });
    resultdrawArr.push(polyline_);
  }

  //초기화 기능
  function resettingMap() {
    if (resultMarkerArr.length > 0) {
      for (var i = 0; i < resultMarkerArr.length; i++) {
        resultMarkerArr[i].setMap(null);
      }
    }

    if (resultdrawArr.length > 0) {
      for (var i = 0; i < resultdrawArr.length; i++) {
        resultdrawArr[i].setMap(null);
      }
    }

    chktraffic = [];
    drawInfoArr = [];
    resultMarkerArr = [];
    resultdrawArr = [];
  }

  function handleGetCurrentLocation() {
    console.log(
      "handlegetcurrent poa",
      currentPosition?.coords,
      mapRef.current
    );
    setCenter(
      currentPosition?.coords.latitude,
      currentPosition?.coords.longitude
    );
    getCurrentPosition((callback) => {
      onLocationRetrieved(callback, true);
    });
  }

  function handleGetRoute() {
    //기존 맵에 있던 정보들 초기화
    resettingMap();
    getRoute({
      startX: "126.9850380932383",
      startY: "37.566567545861645",
      endX: "127.10331814639885",
      endY: "37.403049076341794",
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      searchOption: 0,
      trafficInfo: "Y",
    })
      .then(drawPath)
      .catch((error) => {
        console.log("code:" + "\n" + "message:" + "\n" + "error:" + error);
      });
  }

  function handleGetRouteWithVia() {
    //기존 맵에 있던 정보들 초기화
    resettingMap();
    getRoutewithVia({
      startName: "출발지", //출발지 명칭
      //출발지 위경도 좌표입니다.
      startX: "127.00973587385866",
      startY: "37.56445848334345",
      startTime: "201708081103", //출발 시간(YYYYMMDDHHMM)
      endName: "목적지", //목적지 명칭
      //목적지 위경도 좌표입니다.
      endX: "127.0022149597658",
      endY: "37.56568310756034",
      //경유지 목록 입니다.
      //목록 전체는 대괄호[] 각각의 리스트는 중괄호{}로 묶습니다.
      viaPoints: destionations,
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      searchOption: 0, //경로 탐색 옵션 입니다.
    })
      .then(drawPath)
      .catch((error) => {
        console.log("code:" + "\n" + "message:" + "\n" + "error:" + error);
      });
  }

  //마커 생성하기
  function addMarker(
    status: "llPass" | "llStart" | "llEnd" | "llHub" | "llMine" | "llPoint",
    lon: number,
    lat: number,
    tag: number,
    setCenter?: boolean
  ) {
    var marker: any;
    let imgURL = "";
    const position = new window.Tmapv2.LatLng(lat, lon);
    switch (status) {
      case "llMine":
        imgURL = myLocationSvg;
        break;
      case "llStart":
        imgURL = startSvg;
        break;
      case "llPass":
        imgURL = vias[tag];
        break;
      case "llEnd":
        imgURL = destinationSvg;
        break;
      case "llHub":
        imgURL = hubImage;
        break;
      case "llPoint":
        // imgURL = "http://topopen.tmap.co.kr/imgs/point.png";
        break;
      default:
    }
    marker = new window.Tmapv2.Marker({
      position,
      icon: imgURL,
      map: mapRef.current,
    }); // 마커 드래그 설정
    marker.tag = tag;
    markerList[tag] = marker;
    marker_d = marker;
    setCenter && mapRef.current && mapRef.current.setCenter(position);
    return marker;
  }

  return (
    <div>
      <div id="TMapApp" className={"map"} />
      <div className={"controller"}>
        <Button onClick={handleGetRoute}>ROAD</Button>
        <Button onClick={handleGetRouteWithVia}>VIA ROAD</Button>
      </div>
      <Image
        className={"btn-current-location"}
        preview={false}
        onClick={handleGetCurrentLocation}
        src={btnMyLocationSvg}
      />
    </div>
  );
};
export default TMapComponent;
