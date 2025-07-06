<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  chrome.runtime.openOptionsPage()
  window.close()
})
</script>