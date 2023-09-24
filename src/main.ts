// @ts-nocheck
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VaTeX from 'vatex'
import ElementPlus from 'element-plus'
import MavonEditor from 'mavon-editor'

import App from './App.vue'
import router from './router'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './assets/main.css'
import './style.css'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'mavon-editor/dist/css/index.css'
import 'ant-design-vue/dist/reset.css'

// import 'katex/dist/katex.min.css'

import 'animate.css/animate.min.css'

import "vitepress/dist/client/theme-default/styles/base.css";
import "vitepress/dist/client/theme-default/styles/vars.css";
import "vitepress/dist/client/theme-default/styles/utils.css";
import "vitepress/dist/client/theme-default/styles/fonts.css";

import "vitepress/dist/client/theme-default/styles/components/custom-block.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "vitepress/dist/client/theme-default/styles/components/vp-sponsor.css";

createApp(App)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(router)
  .use(VaTeX)
  .use(ElementPlus)
  .use(MavonEditor)
  .mount('#app')
