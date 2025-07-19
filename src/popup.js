/**
 * 擴充套件彈出視窗的進入點
 * 初始化並掛載 Vue 應用程式
 */
import { createApp } from 'vue'
import PopupApp from './components/PopupApp.vue'
import './style.css'

// 創建並掛載 Vue 應用程式到 #app 元素
createApp(PopupApp).mount('#app')