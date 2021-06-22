import React from "react";
import "../../design/ css/map.address.style.css";

const MapAddressComponent = () => {
  const onClick = () => {};
  return (
    <div className={"container"}>
      <div className={"row"}>
        <button className={"button"} onClick={onClick}>
          경로보기
        </button>
      </div>
    </div>
  );
};

export default MapAddressComponent;
