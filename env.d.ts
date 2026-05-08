interface CloudflareEnv {
  DB: D1Database;
  BUCKET: R2Bucket;
  AGORA_CUSTOMER_ID: string;
  AGORA_CUSTOMER_SECRET: string;
  AGORA_APP_ID: string;
  NEXT_PUBLIC_AGORA_APP_ID: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {}
  }
}
