export const watchLocation = (
  callback: (position: GeolocationPosition) => void
) => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(callback);
  }
};

export const getCurrentPosition = (
  callback: (position: GeolocationPosition | null) => void
) => {
  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {
      callback(position);
      console.log("navigator success");
    });
  } else {
    console.log("navigator error");
    callback(null);
  }
};
