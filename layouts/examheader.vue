<template>
  <div
    class="w-screen h-screen"
    style="background-color: rgba(128, 128, 128, 0.1)"
  >
    <exam-head></exam-head>
    <div
      style="height: calc(100% - 56px); display: flex; flex-direction: column"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Message } from "@arco-design/web-vue";

const codeVaild = async () => {
  const code = localStorage.getItem("paperCode");
  const id = localStorage.getItem("examId");
  const { ok, data } = await httpGet(
    `/api/exam/codeVaild?examId=${id}&code=${code}`,
  );
  if (ok) {
    if (data && data.isValid) {
      Message.error("考试邀请信息错误，请您确保邀请信息无误并重新进入!");
    } else {
      Message.success("考试已开始，预祝同学考试顺利🎉");
    }
  } else {
    Message.error("检查邀请信息出错啦，请联系工作人员解决!");
  }
};
onMounted(() => {
  codeVaild();
});
</script>

<style></style>
