import http from "./http.service";
// @ts-ignore
import S3 from "aws-s3";
const S3_BUCKET_NAME = process.env.REACT_APP_AWS_BUCKET_NAME;
const AWS_REGION = process.env.REACT_APP_AWS_REGION;
const AWS_ACCESS_ID = process.env.REACT_APP_AWS_ACCESS_ID;
const AWS_SECRET_KEY = process.env.REACT_APP_AWS_SECRET_KEY;

const config = {
  bucketName: S3_BUCKET_NAME,
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_ID,
  secretAccessKey: AWS_SECRET_KEY,
};

const S3Client = new S3(config);

export const uploadDirectS3 = (
  file: any,
  onProgress: (progress: number) => void,
  onComplete: (err: any) => void
) => {
  return S3Client.uploadFile(file)
    .then((data: any) => {
      console.log("upload completed", data);
      onComplete(data);
    })
    .catch((err: any) => {
      if (err) {
        console.log("upload error", err);
      }
    });
};

export const uploadThroughBackend = (
  files: File,
  onUploadProgress: (event: any) => void
) => {
  let formData = new FormData();
  formData.append("file", files);
  formData.append("id", "19");

  return http.post("/itemphotos", formData, {
    headers: {
      "Content-Type": "multipart/form-datas",
    },
    onUploadProgress: function (event) {
      console.log("onUploadProgress", event);
      onUploadProgress(event);
    },
  });
};
