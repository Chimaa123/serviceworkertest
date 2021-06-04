import http from "./http.service";
import AWS from "aws-sdk";
const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "delivuspwatest";
const AWS_REGION = process.env.AWS_REGION || "ap-northeast-2";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID || "AKIAQNNRC5IFRWJJVN7H",
  secretAccessKey:
    process.env.AWS_SECRET_KEY || "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",
});

const bucket = new AWS.S3({
  params: { Bucket: S3_BUCKET_NAME },
  region: AWS_REGION,
});

export const uploadDirectS3 = (
  file: any,
  onProgress: (progress: number) => void,
  onComplete: (err: any) => void
) => {
  const params = {
    ACL: "public-read",
    Body: file,
    Bucket: S3_BUCKET_NAME,
    Key: file.name,
  };
  console.log("env", S3_BUCKET_NAME, AWS_REGION);
  return bucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      onProgress(Math.round((evt.loaded / evt.total) * 100));
    })
    .send((err) => {
      if (err) console.log(err);
      onComplete(err);
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
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: function (event) {
      console.log("onUploadProgress", event);
      onUploadProgress(event);
    },
  });
};
