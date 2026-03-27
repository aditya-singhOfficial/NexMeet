const IS_PROD = import.meta.env.VITE_IS_PROD === "true";

const server = IS_PROD
    ? "https://nexmeetbackend-aico.onrender.com"
    : "http://localhost:8000";

export default server;