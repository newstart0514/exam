<template>
  <div
    class="w-screen h-screen"
    style="display: flex; background-color: rgba(128, 128, 128, 0.01)"
  >
    <img src="/loginlabel.jpg" style="flex-basis: 60%; overflow: hidden" />
    <div style="flex-basis: 40%" class="border">
      <slot />
    </div>
  </div>
</template>
