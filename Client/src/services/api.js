import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});




// const API = axios.create({
//   baseURL: "http://localhost:5000",
// });

export default API;