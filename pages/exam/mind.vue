<template>
  <div class="main">
    <a-split
      :style="{
        height: '100%',
        width: '100%',
      }"
      v-model:size="size"
      :min="0.2"
      :max="0.8"
    >
      <template #resize-trigger="{ direction }">
        <div class="split"><icon-drag-dot-vertical /></div>
      </template>
      <template #first>
        <a-typography-paragraph style="margin: 0">
          <div class="card">
            <edit-viewer :content="qaContent"></edit-viewer>
          </div>
          <div class="footer">
            <a-button @click="prev"
              ><icon-left />&nbsp;{{
                index === 0 ? "返回" : "上一题"
              }}</a-button
            >
            <a-button @click="next"
              >{{
                index === count - 1 ? "提交该题型" : "下一题"
              }}&nbsp;<icon-right
            /></a-button>
          </div>
        </a-typography-paragraph>
      </template>
      <template #second>
        <a-typography-paragraph style="margin: 0">
          <edit
            style="height: calc(100vh - 56px)"
            :text="result"
            @update="handleEdit"
            v-if="flag"
          ></edit>
        </a-typography-paragraph>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
const size = ref(0.35);
const qaContent = ref("");
const result = ref("");
let preResult = "";
const flag = ref(false);
const route = useRoute();
const query = route.query;
const index = ref(parseInt(query.index as string));
const count = ref(0);

const handleEdit = (e) => {
  result.value = e;
};
const getQuestion = async () => {
  flag.value = false;
  const id = localStorage.getItem("mind")?.split(",")[index.value];
  const { ok, results, answer } = await httpGet(`/api/exam/question?id=${id}`);
  if (!ok) {
    Message.error("题目获取失败，请与考试方联系!");
  }
  if (results) qaContent.value = results.qaTitle;
  if (answer) {
    result.value = answer;
    preResult = answer;
  } else {
    result.value = "";
    preResult = "";
  }
  flag.value = true;
};
const getCount = () => {
  const Arr = localStorage.getItem("mind")?.split(",");
  count.value = Arr?.length;
};
const next = () => {
  saveAnswer();
  if (index.value !== count.value - 1) {
    index.value++;
    navigateTo(`/exam/mind?index=${index.value}`);
    getQuestion();
  } else {
    const examId = localStorage.getItem("examId");
    navigateTo(`/exam?id=${examId}`);
  }
};
const prev = () => {
  saveAnswer();
  if (index.value !== 0) {
    index.value--;
    navigateTo(`/exam/mind?index=${index.value}`);
    getQuestion();
  } else {
    const examId = localStorage.getItem("examId");
    navigateTo(`/exam?id=${examId}`);
  }
};
const saveAnswer = async () => {
  if (preResult !== result.value) {
    const id = localStorage.getItem("mind")?.split(",")[index.value];
    const answer = {
      qaId: parseInt(id),
      answer: result.value,
    };
    const res = await httpPost("/api/exam/examSubmit", answer);
    if (index.value !== count.value - 1) {
      index.value++;
      navigateTo(`/exam/mind?index=${index.value}`);
      getQuestion();
    } else {
      const examId = localStorage.getItem("examId");
      navigateTo(`/exam?id=${examId}`);
    }
  }
};

onMounted(() => {
  getQuestion();
  getCount();
});
// 定义页面布局
definePageMeta({
  layout: "examheader",
  middleware: ["exam-code-auth"],
});
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
}
.split {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7px;
  height: 100%;
  background-color: rgba(192, 72, 81, 0.2);
}
.card {
  height: calc(100vh - 106px);
}
.footer {
  height: 30px;
  margin: 10px 10px 0 10px;
  display: flex;
  justify-content: space-between;
}
</style>
