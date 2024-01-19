<template>
  <div>
    <type
      :strings="textDate"
      style="position: absolute; top: 40vh; left: 36vw"
    ></type>
    <video
      autoplay
      muted
      style="z-index: -1"
      class="w-screen h-screen position-absolute top-0 left-0 object-fill"
    >
      <source src="/home.mp4" type="video/mp4" />
    </video>
    <a-button
      type="primary"
      shape="round"
      size="large"
      style="
        position: absolute;
        top: calc(40vh + 100px);
        left: calc(35vw + 110px);
        background-color: #ed556a;
      "
      @click="navigateTo('/examList')"
    >
      我要考试
    </a-button>
    <a-button
      shape="round"
      size="large"
      style="
        position: absolute;
        top: calc(40vh + 100px);
        left: calc(35vw + 230px);
        background-color: white;
        color: #ed556a;
      "
      @click="navigateTo('/adminer')"
    >
      举办考试
    </a-button>
  </div>
</template>

<script setup>
const textDate = ["这一次,勇敢冲!"];

useHead({
  title: "致知考试系统",
});
</script>

<style></style>
