import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/style-tw.css'
//import './assets/styles/style.sass'

const app = createApp(App)

app.use(router)

app.mount('#app')
