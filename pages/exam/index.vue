<template>
  <div style="margin: auto;">
    <div class="card">
      <a-row :gutter="16">
        <a-col :span="24">
          <div class="item" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
            <div class="title">试卷详情</div>
            <div class="func">
              <a-button status="danger" style="margin-right: 2rem;">我要交卷</a-button>
            </div>
          </div>
          <a-table
            class="ml mr mt"
            :data="data"
            :bordered="config.boder"
            hoverable
            stripe
            :show-header="config.showHeader"
            :pagination="config.pagination"
          >
            <template #columns>
              <a-table-column title="试题类型" align="center">
                <template #cell="{ record }">
                  {{ questionName[record.type] }}
                </template>
              </a-table-column>
              <a-table-column title="试题数量" align="center">
                <template #cell="{ record }">
                  共{{ record.count }}题
                </template>
              </a-table-column><a-table-column title="试题数量" align="center">
                <template #cell="{ record }">
                  共{{ record.sum }}分
                </template>
              </a-table-column>
              <a-table-column title="操作" align="center" :width="150">
                <template #cell="{ record }">
                  <a-button type="text" status="danger" @click="handleEnter(record)" :disabled="record.count === 0">
                    <template #icon>
                      <icon-edit />
                    </template>
                    开始答题
                  </a-button>
                </template>
              </a-table-column>
          </template>
          </a-table>
        </a-col>
      </a-row>
      <div class="mt mb">
        <a-divider :margin="10"><icon-notification /></a-divider>
      </div>
      <a-row :gutter="16">
        <a-col :span="24">
          <div class="content" style="font-weight: bold; font-size: 15px;">
            考试注意事项：
          </div>
          <div class="content">
            1. 保持诚信：在考试中，要保持诚信，不要试图通过作弊手段来提高分数，否则可能会受到考试主办方的拉黑以及成绩作废处理。
          </div>
          <div class="content">
            2. 保护个人信息：在网络考试过程中，要注意保护自己的个人信息，如手机号码、邮箱等，避免泄露给他人。
          </div>
          <div class="content">
            3. 如果遭遇了断网、死机等问题，您可以修复后继续回到页面答题，或者联系考试主办方进行协调。
          </div>
          <div class="content">
            4. 考试禁止跳出页面：考试跳出页面三次将自动交卷。
          </div>
          <div class="content">
            5. 考试期间如果您需要离开，请向监考官示意。
          </div>
          <div class="content">
            6. 如遇到其他问题，请向考试主办方报告。
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';

const route = useRoute()
const config = {
  showHeader: false,
  boder: true,
  pagination: false
}
let data = ref([
  {type: 'single', count: 0, sum: 0},
  {type: 'multiple', count: 0, sum: 0},
  {type: 'blank', count: 0, sum: 0},
  {type: 'code', count: 0, sum: 0},
  {type: 'mind', count: 0, sum: 0},
])
// 定义页面布局
definePageMeta({
  layout: 'examheader',
  middleware: ['exam-code-auth']
})

const handleComplete = async () => {
  localStorage.removeItem('single')
  localStorage.removeItem('multiple')
  localStorage.removeItem('blank')
  localStorage.removeItem('code')
  localStorage.removeItem('mind')
  localStorage.removeItem('examId')
  localStorage.removeItem('paperCode')
}
const getQuestion = async () => {
  const query = route.query;
  const {ok, results, sums, ids} = await httpGet(`/api/exam/examInfo?id=${query.id}`)
  if(ok) {
    for(let i = 0; i < data.value.length; i++) {
      data.value[i].count = sums[data.value[i].type]
      data.value[i].sum = results[data.value[i].type]
      localStorage.setItem(data.value[i].type, ids[data.value[i].type].join(','))
    }
  }
}
const handleEnter = (rows) => {
  const id = localStorage.getItem(rows.type)?.split(',')[0]
  if(!id) {
    Message.error(`没有${questionName[rows.type]}喔，请您做其他题目吧!`)
  } else {
    navigateTo(`/exam/${rows.type}?index=0`)
  }
}
onMounted(() => {
  const query = route.query;
  getQuestion()
  localStorage.setItem('examId', query.id as string)
})
</script>

<style scoped>
.card {
  height: 80vh;
  width: 60vw;
  border-radius: 8px;
  background: #ffffff;
  box-shadow:  6px 6px 12px #cccccc,
             -6px -6px 12px #cccccc;
}

.item {
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 22px;
  font-weight: bold;
  flex: 1 1 auto;
  text-align: center;
  margin-left: calc(28px + 5rem);
}
.content {
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 0.5rem;
  color: rgba(128, 128, 128, 1);
}
.func {
  flex: 0 0 auto;
}
</style>

