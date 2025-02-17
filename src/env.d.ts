/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly DIFY_BASE_URL: string
  readonly WORKFLOW_1_KEY: string
  readonly WORKFLOW_1_NAME: string
  readonly WORKFLOW_2_KEY: string
  readonly WORKFLOW_2_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 