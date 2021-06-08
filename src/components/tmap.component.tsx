import React, { useEffect } from "react";
import { watchLocation } from "../services/location.service";
import { Button } from "antd";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

const TMapComponent = () => {
  let map: any;
  let InfoWindow: any;
  let marker_s, marker_d;

  useEffect(() => {
    watchLocation(onLocationRetrieved);
    initTmap();
  }, []);

  function initTmap() {
    console.log("initMAp", window.Tmapv2);
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
      map: map,
    });

    marker_d.addListener("mouseenter", function (evt: any) {
      InfoWindow = new window.Tmapv2.InfoWindow({
        position: new window.Tmapv2.LatLng(
          37.56445848334345,
          127.00973587385866
        ),
        content:
          "<div style=' position: relative; border-bottom: 1px solid #dcdcdc; line-height: 18px; padding: 0 35px 2px 0;'>" +
          "<div style='font-size: 12px; line-height: 15px;'>" +
          "<span style='display: inline-block; width: 40px; height: 14px; vertical-align: middle; margin-right: 5px;'></span>목적지" +
          "</div>" +
          "</div>",
        type: 2,
        map: map,
      });
    });
    //Marker에 마우스가 마커를 벗어났을때 이벤트 등록.
    marker_d.addListener("mouseleave", function (evt: any) {
      InfoWindow.setVisible(false);
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
    const lat = geolocation.coords.latitude; // 위도
    const lon = geolocation.coords.longitude; // 경도
    const position = new window.Tmapv2.LatLng(lat, lon);
    marker_s = new window.Tmapv2.Marker({
      id: "currentLocation",
      position,
      draggable: true, //Marker의 드래그 가능 여부.
      icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
      iconSize: new window.Tmapv2.Size(24, 38),
      map: map,
    });

    InfoWindow = new window.Tmapv2.InfoWindow({
      position: new window.Tmapv2.LatLng(lat, lon),
      content:
        "<div style=' position: relative; border-bottom: 1px solid #dcdcdc; line-height: 18px; padding: 0 35px 2px 0;'>" +
        "<div style='font-size: 12px; line-height: 15px;'>" +
        "<span style='display: inline-block; width: 14px; height: 14px; background-image: url(/resources/images/common/icon_blet.png); vertical-align: middle; margin-right: 5px;'></span>현재위치" +
        "</div>" +
        "</div>",
      type: 2,
      map: map,
    });
    setCenter && map && map.setCenter(position);
  }

  function changeMapType(type: "SATELLITE" | "HYBRID" | "ROAD") {
    console.log("changeMapType", type);
    if ("SATELLITE" === type) {
      map.setMapType(window.Tmapv2.Map.MapType.SATELLITE);
    } else if ("HYBRID" === type) {
      map.setMapType(window.Tmapv2.Map.MapType.HYBRID);
    } else if ("ROAD" === type) {
      map.setMapType(window.Tmapv2.Map.MapType.ROAD);
    }
  }

  function onClick() {}

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
