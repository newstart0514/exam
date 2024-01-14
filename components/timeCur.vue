<template>
  <span style="font-size: 32px; font-family: 'jinghong';">
    {{ formatTime(currentTime) }}
  </span>
</template>

<script lang="ts" setup>
let currentTime = ref(getCurrent());
let timer: NodeJS.Timeout;

function getCurrent() {
  return new Date();
}
function formatTime(time: Date) {
  let formatted = time.toLocaleString('default', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'  
  })
  return formatted
}
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = getCurrent()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style>

</style>

