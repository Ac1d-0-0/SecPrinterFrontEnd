import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'





const app = createApp(App)
app.use(ElementPlus)
app.use(VueAxios, axios)
app.use(router).mount('#app')

const {app1,Menu,Tray} = require("electron")
app1.whenReady().then(() => {
    let tray = null
    tray = new Tray("./icon.jpg")
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})




