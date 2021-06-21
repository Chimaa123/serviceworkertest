import React, { useMemo, useState } from "react";

import Button from "antd/lib/button";
import { Progress, Row, Col, Tabs } from "antd";
import CameraComponent from "./camera.component";
import { uploadFile } from "../../services/indexdb.service";

const { TabPane } = Tabs;
const MESSAGE_NO_CURRENT_IMAGE = 10;
const MESSAGE_UPLOAD_ERROR = 11;
const MESSAGE_UPLOAD_SUCCESS = 1;
const MESSAGE_NONE = 0;

const UploadPhotoComponent = () => {
  const [messageCode, setMessage] = useState(MESSAGE_NONE);
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState<File>();
  const previewImage = useMemo(
    () => (currentImage ? URL.createObjectURL(currentImage) : null),
    [currentImage]
  );

  const selectGaleryPhoto = (event: any) => {
    setCurrentImage(event.target.files[0]);
    setMessage(MESSAGE_NONE);
    setProgress(0);
  };

  const selectCameraPhoto = (file: any) => {
    setCurrentImage(file);
    setMessage(MESSAGE_NONE);
    setProgress(0);
  };

  const refresh = () => {
    setProgress(0);
    setCurrentImage(undefined);
  };

  const uploadPhoto = () => {
    setProgress(0);
    setMessage(MESSAGE_NONE);

    if (!currentImage) {
      setMessage(MESSAGE_NO_CURRENT_IMAGE);
      return;
    }
    alert("Image will be uploaded...");

    uploadFile(
      currentImage,
      (progress) => {
        console.log("upload", progress);
        setProgress(progress);
      },
      (err) => {
        if (err) {
          refresh();
          console.log("err", err);
          setMessage(MESSAGE_UPLOAD_ERROR);
        } else {
          setMessage(MESSAGE_UPLOAD_SUCCESS);
          setProgress(100);
          setTimeout(refresh, 1000);
        }
      }
    );
  };

  console.log("progress:", progress, "message:", messageCode);
  const progressBar = (
    <Row>
      <div>{currentImage?.name}</div>
      <Progress percent={progress} />
    </Row>
  );

  const imageViewer = previewImage && (
    <Col>
      <img
        style={{
          width: "100%",
          height: window.innerHeight / 2,
          objectFit: "contain",
        }}
        src={previewImage}
        alt=""
      />
      <Button disabled={!currentImage} onClick={uploadPhoto}>
        Upload Photo
      </Button>
      {!!progress && progressBar}
    </Col>
  );

  return (
    <Col style={{ padding: 20 }}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Gallery" key="1">
          <input type="file" accept="image/*" onChange={selectGaleryPhoto} />
        </TabPane>
        <TabPane tab="Camera" key="2">
          <CameraComponent onSubmit={selectCameraPhoto} />
        </TabPane>
      </Tabs>
      {imageViewer}
    </Col>
  );
};

export default UploadPhotoComponent;
