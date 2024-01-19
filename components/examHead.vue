<template>
  <div style="display: flex" class="header">
    <div class="title">
      <div style="margin-top: 13px">2024年网络信息中心招新考试</div>
    </div>
    <div style="position: absolute; right: 0.5rem; top: 8px">
      <span style="font-family: &quot;jinghong&quot;; font-size: 26px"
        >考试倒计时: </span
      ><time-cur></time-cur>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-family: "jinghong";
  height: 56px;
  font-size: 26px;
  margin-left: 1rem;
}
.header {
  background-image: url(/bg.png);
  background-size: cover;
  background-position: top;
}
.item {
  height: 56px;
  color: white;
}
.item:hover {
  color: red;
}
</style>
