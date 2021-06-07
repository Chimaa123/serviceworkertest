import http from "./http.service";
import AWS from "aws-sdk";
const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "delivuspwa";
const AWS_REGION = process.env.AWS_REGION || "ap-northeast-2";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID || "AKIARBBRIOAM6BIKEVS2",
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
      const progress = Math.round((evt.loaded / evt.total) * 100);
      onProgress(progress);
    })
    .send((err) => {
      if (err) console.log(err);
      alert("Upload completed");
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
