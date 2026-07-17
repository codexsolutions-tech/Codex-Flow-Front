import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

const { APPLICATION_ENVIRONMENT, APPLICATION_PORT, ENVIRONMENT_CONSOLE, PRODUCTION } = process.env;
console.log(PRODUCTION);
console.log("Você está no ambiente de " + ENVIRONMENT_CONSOLE?.toString());
export default defineConfig({
  plugins: [react()],
  server: {
    host: APPLICATION_ENVIRONMENT,
    port: Number(APPLICATION_PORT),
  },
});
