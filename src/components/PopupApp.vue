<template>
  <div></div>
</template>

<script setup>
/**
 * 擴充功能彈出視窗元件
 * 
 * 功能：
 * - 開啟選項頁面並關閉彈出視窗
 * - 作為快速進入設定頁面的捷徑
 */
import { onMounted } from 'vue'

// 元件掛載時立即開啟選項頁面並關閉彈出視窗
onMounted(() => {
  chrome.runtime.openOptionsPage()
  window.close()
})
</script>