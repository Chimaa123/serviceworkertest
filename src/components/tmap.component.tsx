import React, { useEffect, useState } from "react";
import {
  getCurrentPosition,
  watchLocation,
} from "../services/location.service";
import { Button } from "antd";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

const height = window.innerHeight;

const TMapComponent = () => {
  let map: any;
  let InfoWindow: any;
  let marker_s, marker_d;
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    getCurrentPosition(onLocationRetrieved);
    watchLocation(onLocationRetrieved);
    initTmap();
  }, []);

  function initTmap() {
    // 1. 지도 띄우기
    map = new window.Tmapv2.Map("TMapApp", {
      center: new window.Tmapv2.LatLng(37.566481622437934, 126.98502302169841),
      width: "100%",
      height: "100%",
      zoom: 15,
    });

    map.addListener("click", onClick);

    // 도착
    marker_d = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(37.56445848334345, 127.00973587385866),
      icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
      iconSize: new window.Tmapv2.Size(24, 38),
      draggable: true,
      map: map,
    });
  }

  function onLocationRetrieved(position: GeolocationPosition | null) {
    console.log("onLocation retrieved", position);
    displayGeolocationmarker(position, true);
  }

  function displayGeolocationmarker(
    geolocation: GeolocationPosition | null,
    setCenter: boolean
  ) {
    if (geolocation == null) {
      return;
    }
    const lat = 37.566481622437934; // geolocation.coords.latitude, // 위도
    const lon = 126.98502302169841; //geolocation.coords.longitude; // 경도
    const position = new window.Tmapv2.LatLng(lat, lon);
    marker_s = new window.Tmapv2.Marker({
      position,
      draggable: true, //Marker의 드래그 가능 여부.
      icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
      iconSize: new window.Tmapv2.Size(24, 38),
      map: map,
    });
    InfoWindow = new window.Tmapv2.InfoWindow({
      position: new window.Tmapv2.LatLng(lat, lon),
      content: "<div>현재위치</div>",
      type: 2,
      map: map,
    });
    setCenter && map && map.setCenter(position);
  }

  function changeMapType(type: "SATELLITE" | "HYBRID" | "ROAD") {
    console.log("changeMapType", type);
    if ("SATELLITE" == type) {
      map.setMapType(window.Tmapv2.Map.MapType.SATELLITE);
    } else if ("HYBRID" == type) {
      map.setMapType(window.Tmapv2.Map.MapType.HYBRID);
    } else if ("ROAD" == type) {
      map.setMapType(window.Tmapv2.Map.MapType.ROAD);
    }
  }

  function onClick() {
    console.log("onclick on map");
  }

  return (
    <div>
      <div
        className="map_act_btn_wrap clear_box"
        style={{ position: "absolute", zIndex: 1, paddingLeft: 10 }}
      >
        <Button onClick={() => changeMapType("ROAD")}>ROAD</Button>
        <Button onClick={() => changeMapType("SATELLITE")}>SATELLITE</Button>
        <Button onClick={() => changeMapType("HYBRID")}>HYBRID</Button>
      </div>
      <div
        id="TMapApp"
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
        }}
      />
    </div>
  );
};
export default TMapComponent;
