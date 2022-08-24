import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Vuex from 'vuex'
import store from './components/GlobalVars'



const appPrinter = createApp(App)
appPrinter.use(ElementPlus).use(Vuex).use(store)
appPrinter.mount('#app')

