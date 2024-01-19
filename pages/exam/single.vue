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
          {{ qaInfo.qaTitle }}
        </div>
        <div style="max-height: 40%; margin-top: 1.5rem; max-width: 100%">
          <div v-for="item in qaInfo.qaContent" :key="item.text">
            <mul-btn
              :title="item.title"
              :content="item.text"
              :active="choice === item.title"
              @click="choose(item)"
              style="margin-top: 0.5rem"
            >
            </mul-btn>
          </div>
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
import { Message } from "@arco-design/web-vue";

const route = useRoute();
const query = route.query;
// 定义页面布局
definePageMeta({
  layout: "examheader",
  middleware: ["exam-code-auth"],
});

let choice = ref("");
let preChoice = "";
let qaInfo = ref({
  qaTitle: "",
  qaContent: [],
});
let count = ref(0);
const index = ref(parseInt(query.index as string));

const choose = (item) => {
  if (choice.value !== item.title) {
    choice.value = item.title;
  }
};
const tabChoose = (num) => {
  navigateTo(`/exam/single?index=${num - 1}`);
  index.value = num - 1;
  getQuestion();
};
const saveAnswer = async () => {
  if (preChoice !== choice.value) {
    const id = localStorage.getItem("single")?.split(",")[index.value];
    const answer = {
      qaId: parseInt(id),
      answer: choice.value,
    };
    const res = await httpPost("/api/exam/examSubmit", answer);
  }
};
const next = () => {
  saveAnswer();
  if (index.value !== count.value - 1) {
    index.value++;
    navigateTo(`/exam/single?index=${index.value}`);
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
    navigateTo(`/exam/single?index=${index.value}`);
    getQuestion();
  } else {
    const examId = localStorage.getItem("examId");
    navigateTo(`/exam?id=${examId}`);
  }
};
const getQuestion = async () => {
  const id = localStorage.getItem("single")?.split(",")[index.value];
  const { ok, results, answer } = await httpGet(`/api/exam/question?id=${id}`);
  if (!ok) {
    Message.error("题目获取失败，请与考试方联系!");
  }
  qaInfo.value.qaTitle = `${index.value + 1}.${results.qaTitle}`;
  const content = results.qaContent.split("\r\n");
  const newArr = [];
  for (let i = 0; i < content.length; i++) {
    const obj = {
      title: choiceTitle[i],
      text: content[i],
    };
    newArr.push(obj);
  }
  qaInfo.value.qaContent = newArr;
  if (answer) {
    choice.value = answer;
    preChoice = answer;
  } else {
    choice.value = "";
    preChoice = "";
  }
};
const getCount = () => {
  const Arr = localStorage.getItem("single")?.split(",");
  count.value = Arr?.length;
};
onMounted(() => {
  if (isNaN(index.value)) {
    Message.error("获取题目失败，请在左侧选择题目!");
  }
  getQuestion();
  getCount();
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
  font-size: 13px;
}
</style>
