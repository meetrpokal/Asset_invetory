import axios from "axios";

// For Vite, environment variables need VITE_ prefix, fallback to REACT_APP_ for compatibility
const baseURL = import.meta.env.VITE_API_URL || 
                import.meta.env.REACT_APP_API_URL || 
                'http://localhost:5000/api/v1';
                
// console.log("Axios base URL:", baseURL);

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // console.log("Added Authorization header to request:", config.url);
        } else {
            // console.log("No token found for request:", config.url);
        }
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        // console.log("API Response successful:", response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error("API Response error:", error.config?.url, error.response?.status);
        
        if (error.response?.status === 401) {
            // Only clear token if we're not on the login page and it's not a login request
            const isLoginRequest = error.config?.url?.includes('/login');
            const isOnLoginPage = window.location.pathname === '/login';
            
            if (!isLoginRequest && !isOnLoginPage) {
                // Token is invalid/expired, clear localStorage
                // Let the router components (like ProtectedRoute) handle the actual redirect
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;