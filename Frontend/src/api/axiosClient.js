import axios from 'axios';
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
const axiosClient = axios.create({
  baseURL: 'http://localhost:8084/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// axiosClient.interceptors.request.use((config) => {
//   const token = getCookie("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosClient;