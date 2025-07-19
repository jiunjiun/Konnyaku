/**
 * 擴充套件設定頁面的進入點
 * 初始化並掛載 Vue 應用程式
 */
import { createApp } from 'vue'
import OptionsApp from './components/OptionsApp.vue'
import './style.css'

// 創建並掛載 Vue 應用程式到 #app 元素
createApp(OptionsApp).mount('#app')