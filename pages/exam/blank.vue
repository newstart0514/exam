<template>
  <div class="main">
    <div class="left">
      <div class="card">
        <div class="title">答题卡</div>
        <a-divider />
        <div class="content ml mr btnGroup">
          <mul-btn
            v-for="num in count"
            :key="num"
            :title="num.toString()"
            class="itemBtn"
            @click="tabChoose(num)"
          ></mul-btn>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="contentCard">
        <div class="question" style="max-height: 40%">
          {{ qaTitle }}
        </div>
        <div style="max-height: 40%; margin-top: 0.5rem; max-width: 100%">
          <edit
            style="height: 50vh"
            :text="result"
            @update="handleEdit"
            v-if="flag"
          ></edit>
        </div>
        <div style="max-height: 10%" class="footer">
          <a-button @click="prev"
            ><icon-left />&nbsp;{{ index === 0 ? "返回" : "上一题" }}</a-button
          >
          <a-button @click="next"
            >{{
              index === count - 1 ? "提交该题型" : "下一题"
            }}&nbsp;<icon-right
          /></a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 定义页面布局
definePageMeta({
  layout: "examheader",
  middleware: ["exam-code-auth"],
});

const route = useRoute();
const query = route.query;
const index = ref(parseInt(query.index as string));
const flag = ref(false);
const result = ref("");
const qaTitle = ref("");
const count = ref(0);
let preAnswer = "";

const handleEdit = (e) => {
  result.value = e;
};
const getQuestion = async () => {
  flag.value = false;
  const id = localStorage.getItem("blank")?.split(",")[index.value];
  const { ok, results, answer } = await httpGet(`/api/exam/question?id=${id}`);
  if (!ok) {
    Message.error("题目获取失败，请与考试方联系!");
  }
  if (results) qaTitle.value = `${index.value + 1}.${results.qaTitle}`;
  if (answer) {
    result.value = answer;
    preAnswer = answer;
  } else {
    result.value = "";
    preAnswer = "";
  }
  flag.value = true;
};
const getCount = () => {
  const Arr = localStorage.getItem("blank")?.split(",");
  count.value = Arr?.length;
};
const tabChoose = (num: number) => {
  navigateTo(`/exam/blank?index=${num - 1}`);
  index.value = num - 1;
  getQuestion();
};
const saveAnswer = async () => {
  if (preAnswer !== result.value) {
    const id = localStorage.getItem("blank")?.split(",")[index.value];
    const answer = {
      qaId: parseInt(id),
      answer: result.value,
    };
    const res = await httpPost("/api/exam/examSubmit", answer);
  }
};
const next = () => {
  saveAnswer();
  if (index.value !== count.value - 1) {
    index.value++;
    navigateTo(`/exam/blank?index=${index.value}`);
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
    navigateTo(`/exam/blank?index=${index.value}`);
    getQuestion();
  } else {
    const examId = localStorage.getItem("examId");
    navigateTo(`/exam?id=${examId}`);
  }
};

onMounted(() => {
  getCount();
  getQuestion();
});
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
}
.left {
  width: 20%;
  height: 100%;
}
.right {
  width: 80%;
  height: 100%;
}
.left,
.right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  height: 90%;
  width: 60%;
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    6px 6px 12px #cccccc,
    -6px -6px 12px #cccccc;
}
.contentCard {
  height: 90%;
  width: 90%;
}
.question {
  font-family: "kaiti";
  font-size: 17.5px;
}
.footer {
  position: absolute;
  bottom: 2rem;
  margin-left: 1rem;
  width: 70%;
  display: flex;
  justify-content: space-between;
}
.title {
  margin-top: 1rem;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
}
.btnGroup {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.itemBtn {
  flex: 1 1 auto;
  margin: 2px;
  width: 30%;
  height: 30%;
}
</style>
