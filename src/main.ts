import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VaTeX from 'vatex'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './style.css'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VaTeX)
app.use(ElementPlus)

app.mount('#app')
