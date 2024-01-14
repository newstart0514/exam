<template>
  <div class="main">
    <a-split :style="{
        height: '100%',
        width: '100%'
      }"
      v-model:size="size"
      :min="0.2"
      :max="0.8"
    >
      <template #resize-trigger="{ direction }">
        <div class="split"><icon-drag-dot-vertical /></div>
      </template>
      <template #first>
        <a-typography-paragraph style="margin:0;">
          <div class="card">
            <edit-viewer :content="qaContent"></edit-viewer>
          </div>
        </a-typography-paragraph>
      </template>
      <template #second>
        <a-typography-paragraph style="margin: 0;">
          <div class="code">
            <div class="header">
              <a-select :style="{width:'120px'}" v-model="language" @change="handleChange">
                <a-option v-for="item in languageArr" :key="item">{{ item }}</a-option>
              </a-select>
            </div>
            <!-- <code-edit :lang="language" :code="code" style="height: calc(100vh - 136px);width: 100%;"></code-edit> -->
            <CodeEditor 
              v-model="code" 
              :lang="language"
              :options="{ theme: 'vs-dark' }"
              style="height: calc(100vh - 136px);width: 100%;"
            >
              代码编辑器正在加载中，请稍等......
            </CodeEditor>
            <div class="footer">
              <div style="font-size: 14px;margin-top: 2px;">代码运行结果：</div>
              <div class="btn">
                <a-button class="mr" @click="runCode">运行代码</a-button>
                <a-button type="primary" status="danger" @click="saveAnswer">保存提交</a-button>
              </div>
            </div>
          </div>
        </a-typography-paragraph>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
const size = ref(0.35)
const qaContent = ref('')
const language = ref('javascript')
const languageArr = ref(['javascript', 'typescript', 'html','java','sql','go','shell','python','cpp','php'])
const code = ref('console.log(66666)')
const count = ref(0)
let preCode = ''
const route = useRoute()
const query = route.query;
const index = ref(parseInt(query.index as string))

const handleChange = (val: string) => {
  language.value = val
}
const getQuestion = async () => {
  const id = localStorage.getItem('code')?.split(',')[index.value]
  const {ok, results, answer} = await httpGet(`/api/exam/question?id=${id}`)
  if(!ok) {
    Message.error('题目获取失败，请与考试方联系!')
  }
  if(results) qaContent.value = results.qaTitle
  const codeArr = answer.split('\r\n&line*\r\n')
  if(answer) {
    code.value = codeArr[1]
    language.value = codeArr[0]
    preCode = codeArr[1]
  } else {
    code.value = ''
    preCode = ''
  }
}
const getCount = () => {
  const Arr = localStorage.getItem('code')?.split(',')
  count.value = Arr?.length
}
const saveAnswer = async () => {
  if(preCode !== code.value) {
    const id = localStorage.getItem('code')?.split(',')[index.value]
    const answer = {
      qaId: parseInt(id),
      answer: `${language.value}\r\n&line*\r\n${code.value}`
    }
    const res = await httpPost('/api/exam/examSubmit', answer)
    if(index.value !== count.value - 1) {
      index.value++
      navigateTo(`/exam/single?index=${index.value}`)
      getQuestion()
    } else {
      const examId = localStorage.getItem('examId')
      navigateTo(`/exam?id=${examId}`)
    }
  }
}
const runCode = () => {
  // 执行代码
  saveAnswer()
}

onMounted(() => {
  getQuestion()
  getCount()
})
// 定义页面布局
definePageMeta({
  layout: 'examheader',
  middleware: ['exam-code-auth']
})
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
.btn {
  position: absolute;
  right: 0.5rem;
}
.footer {
  height: 30px;
  margin-top: 10px;
  display: flex;
}
.code {
  background-color: rgba(255, 255, 255, 0.16);
}
.header {
  height: 30px;
}
</style>

