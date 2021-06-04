import axios from "axios";

export default axios.create({
  baseURL: "http://10.106.110.189:5000/api",
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});
