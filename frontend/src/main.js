import { createApp } from 'vue'
import App from './App.vue'
import store from '@/x/store'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// template custom css
import './assets/scss/bundles.scss'
import './assets/scss/style.scss'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

