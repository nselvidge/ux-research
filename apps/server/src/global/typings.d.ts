declare module "fastify" {
  interface Session {
    zoomCode?: string | null;
    id?: number;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "staging";
    }
  }
}

export {};
