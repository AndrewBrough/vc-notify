/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DISCORD_BOT_TOKEN: string;
  readonly DISCORD_BOT_DATA_DIR: string;
  readonly DISCORD_CLIENT_ID: string;
  readonly DISCORD_INVITE_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
