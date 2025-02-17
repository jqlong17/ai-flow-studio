import TextContent from './TextContent.vue'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.component('TextContent', TextContent)
  }
}

export { TextContent } 