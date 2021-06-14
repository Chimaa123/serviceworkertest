import React, { useEffect, useRef } from "react";
import { Col, Row } from "antd";

const videoStyles = {
  display: "flex",
};

type Props = {
  onSubmit: (photo: any) => void;
};
const CameraComponent = ({ onSubmit }: Props) => {
  let stream: any = null;
  let streamWidth = 0;
  let streamHeight = 0;
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  let canvasContext: any = null;

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    console.log("stopCamera", stream);
    if (!stream) return;
    stream.getTracks().map((t: MediaStreamTrack) => t.stop());
    stream = null;
    streamWidth = 0;
    streamHeight = 0;
    canvasContext = null;
  };

  const startCamera = async () => {
    console.log("startCamera");
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stm) => {
        let video: any = videoRef.current;
        stream = stm;
        video.srcObject = stm;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const paintToCanvas = () => {
    console.log("paintToCanvas");
    let video: any = videoRef.current;
    let photo: any = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 200);
  };

  const takePhoto = () => {
    let photo: any = photoRef.current;
    let strip: any = stripRef.current;

    const data = photo.toBlob(onSubmit);

    // const link = document.createElement("a");
    // link.href = datas;
    // link.setAttribute("download", "myWebcam");
    // link.innerHTML = `<img src='${datas}' alt='thumbnail'/>`;
    // strip.insertBefore(link, strip.firstChild);
    // onSubmit({target: {files: [datas]}});
  };

  return (
    <Col>
      <button onClick={takePhoto}>Take a photo</button>
      <Row>
        <video
          ref={videoRef}
          onCanPlay={() => paintToCanvas()}
          style={{ ...videoStyles }}
        />
        <canvas ref={photoRef} />
      </Row>
      <div>
        <div ref={stripRef} />
      </div>
    </Col>
  );
};

export default CameraComponent;
