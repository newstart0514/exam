<template>
  <div class="header">
    <img src="/logo.png" class="logo mb" />
    <div class="btn-group">
      <a-button
        shape="circle"
        style="margin-right: 0.75rem"
        @click="navigateTo('/')"
      >
        <template #icon>
          <icon-home />
        </template>
      </a-button>
      <a-button
        shape="circle"
        style="margin-right: 0.75rem"
        @click="handleFullScreen"
      >
        <template #icon>
          <icon-fullscreen v-if="!fullscreen" />
          <icon-fullscreen-exit v-else />
        </template>
      </a-button>
      <a-dropdown position="bottom" trigger="hover">
        <a-avatar :style="{ backgroundColor: '#c04851' }" :size="32">
          <IconUser />
        </a-avatar>
        <template #content>
          <a-doption>切换账号</a-doption>
          <a-doption>退出登录</a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
const fullscreen = ref(false);
const handleFullScreen = () => {
  if (fullscreen.value) {
    // 退出全屏
    document.exitFullscreen();
    fullscreen.value = false;
  } else {
    // 进入全屏模式
    document.documentElement.requestFullscreen();
    fullscreen.value = true;
  }
};
</script>

<style scoped>
.header {
  display: flex;
}
.btn-group {
  display: flex;
  position: absolute;
  right: 1rem;
  height: 32px;
  margin-top: 8px;
}

.logo {
  height: 32px;
  margin-left: 0.5rem;
  margin-top: 8px;
}
</style>
