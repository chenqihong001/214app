import { createApp } from 'vue'
import App from './App.vue'
import {
    Button,
    NavBar,
    Tab,
    Tabs,
    Popup,
    Picker,
    Row,
    Col,
    Icon
} from 'vant' import 'vant/lib/index.css'

const app = createApp(App)

    // 注册 Vant 组件
    ;[
        Button,
        NavBar,
        Tab,
        Tabs,
        Popup,
        Picker,
        Row,
        Col,
        Icon
    ].forEach(component => app.use(component))

app.mount('#app') 