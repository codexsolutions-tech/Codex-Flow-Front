import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log(`Ambiente: ${env.ENVIRONMENT_CONSOLE}`);
  console.log(`Produção: ${env.PRODUCTION}`);

  return {
    plugins: [react()],
    server: {
      host: env.APPLICATION_ENVIRONMENT,
      port: Number(env.APPLICATION_PORT),
    },
  };
});
