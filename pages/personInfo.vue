<template>
  <div class="mt ml mr">
        <div>
          <span class="title">个人信息</span>
          <a-tag color="red" bordered style="margin-top: -1rem;margin-left: 0.8rem;">当前参加的考试为: {{paperInfo.paperName}}</a-tag>
          <span class="timeClass">
            <span style="align-self: flex-end;">离考试开始还有</span>
            <a-countdown
              v-if="paperInfo.startTime"
              title=""
              :value="Date.now() + timeLimit"
              :now="Date.now()"
              @finish="handleFinsh"
            />
          </span>
        </div>
        <a-divider></a-divider>
        <div class="card">
          <a-form ref="formRef" :model="personInfo" layout="vertical">
            <a-form-item field="name" label="姓名">
              <a-input v-model="personInfo.name" placeholder="请输入姓名..." />
              <template #extra>
                <div>请填写真实姓名,否则后续成绩作废</div>
              </template>
            </a-form-item>
            <a-form-item field="studentId" label="学号">
              <a-input v-model="personInfo.studentId" placeholder="请输入学号..." />
              <template #extra>
                <div>请填写真实学号,否则后续成绩作废</div>
              </template>
            </a-form-item>
            <a-form-item field="from" label="班级" tooltip="示例：21通信工程2班">
              <a-input v-model="personInfo.from" placeholder="请输入班级..."/>
              <template #extra>
                <div>我们不限制您来自什么专业，只是通过班级来了解您的经历</div>
              </template>
            </a-form-item>
            <a-form-item field="email" label="邮箱" tooltip="后续您可以凭借此邮箱获取您的应聘进展">
              <a-input v-model="personInfo.email" placeholder="请输入邮箱..." />
            </a-form-item>
            <a-form-item field="phone" label="手机号码" tooltip="后续您可以凭借此手机号码获取您的应聘进展">
              <a-input v-model="personInfo.phone" placeholder="请输入手机号码..." />
            </a-form-item>
          </a-form>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-button shape="round" @click="back" style="margin-left: -0.5rem;position: relative;top: 0.5rem">返回</a-button>
            </a-col>
            <a-col :span="12">
              <a-button 
                shape="round" 
                type="primary" 
                status="danger" 
                @click="saveStudent" style="float: right;margin-right: -0.5rem;position: relative;top: 0.5rem"
              >进入考试</a-button>
            </a-col>
          </a-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Modal } from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';
import '@arco-design/web-vue/es/modal/style/css.js'
import '@arco-design/web-vue/es/tooltip/style/css.js'

const personInfo = ref({
  name: '',
  from: '',
  studentId: '',
  email: '',
  phone: ''
})
const paperInfo = ref({
  id: 0,
  paperName: '',
  desc: '',
  startTime: '',
  endTime: ''
})
const timeLimit = ref(0)
const isStart = ref(true)
const router = useRouter()
const route = useRoute()
// 定义页面布局
definePageMeta({
  layout: 'lrform',
  middleware: ['exam-code-auth']
})

const back = () => {
  router.back();
}
const saveStudent = () => {
  if(!isStart.value) {
    Message.warning('考试还没开始，请耐心等待......')
    return;
  }
  saveInfo()
  navigateTo(`/exam?id=${route.query.examId}`)
}
const getExam = async () => {
  if(route.query.examId) {
    const res = await httpGet(`/api/exam?id=${route.query.examId}`)
    paperInfo.value = res
    const start = new Date(paperInfo.value.startTime).getTime()
    const cur = new Date().getTime()
    if(start > cur) {
      timeLimit.value = start - cur
      isStart.value = false
    }
  }
}
const saveInfo = async () => {
  const postData = personInfo.value
  const {ok, data} = await httpPost('/api/saveStuInfo', postData)
}
const handleFinsh = () => {
  isStart.value = true
}
onMounted(() => {
  getExam()
  Modal.info({
    title: '欢迎参加考试',
    content: `同学，欢迎你参加考试。在这个充满挑战与机遇的时刻，我们诚挚地邀请你填写个人信息。
      我们珍惜每一次的相遇，更不想让未来的岁月将我们失联。
    `,
    okText: '收到'
  })
})
</script>

<style scoped>
.title {
  font-family: 'jinghong';
  font-size: 32px;
}
.card {
  padding: 2rem;
  margin: 0.8rem 0.8rem 1.5rem 0.8rem;
  border-radius: 8px;
  background: #ffffff;
  box-shadow:  6px 6px 12px #cccccc,
             -6px -6px 12px #ffffff;
}
.timeClass {
  float: right;
  margin-right: 0.5rem;
  margin-top: -0.5rem;
  display: flex;
  flex-direction: column;
}
</style>

