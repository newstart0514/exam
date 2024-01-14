<template>
  <div style="margin: 1rem 2rem;">
    <a-card
      class="card"
      title="试卷详情"
      :bordered="false"
    >
      <template #extra>
        <!-- 右上角 -->
        <a-button type="text" status="success" @click="handleSave">
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </template>
      <a-form :model="form" auto-label-width style="margin: 0 -0.25rem;">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
              field="paperName" 
              label="试卷名称" 
              :rules="[{required:true,message:'请填写试卷名称'}]"
              :validate-trigger="['change','input']"
            >
              <a-input v-model="form.paperName" :max-length="20" placeholder="请输入试卷名称..." />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item 
              field="paperCode" 
              label="试卷邀请码" 
              tooltip="用于其他人加入该试卷" 
              :rules="[{required:true,message:'请填写试卷邀请码'}]"
              :validate-trigger="['change','input']"
            >
              <a-input v-model="form.paperCode" placeholder="请输入邀请码..." />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
              field="startTime"
              label="考试开始时间"
              :rules="[{required:true,message:'请填写考试开始时间'}]"
              :validate-trigger="['change']"
            >
              <a-date-picker
                style="width: 100%;"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="form.startTime"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item 
              field="endTime" 
              label="考试结束时间" 
              :rules="[{required:true,message:'请填写考试开始时间'}]"
              :validate-trigger="['change']"
            >
              <a-date-picker
                style="width: 100%;"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="form.endTime"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item field="desc" label="试卷描述" tooltip="它会在试卷列表展示给考生">
              <a-textarea v-model="form.desc" placeholder="请输入描述..." :max-length="170" show-word-limit />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider :margin="10"><icon-file /></a-divider>
      <a-row :gutter="16">
        <a-col :span="24">
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
              <a-table-column title="试题类型" align="center" :width="150">
                <template #cell="{ record }">
                  {{ questionName[record.type] }}
                </template>
              </a-table-column>
              <a-table-column title="试题描述" align="center">
                <template #cell="{ record }">
                  {{ record.description }}
                </template>
              </a-table-column>
              <a-table-column title="操作" align="center" :width="150">
                <template #cell="{ record }">
                  <a-button 
                    type="text" 
                    status="success"
                    @click="navigateTo(`/adminer/questionToExam?type=${record.type}&id=${queryId}`)"
                  >
                    去选题
                  </a-button>
                </template>
              </a-table-column>
          </template>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';

const route = useRoute()
const router = useRouter()
const form = ref({
  paperCode: '',
  paperName: '',
  startTime: '',
  endTime: '',
  desc: ''
})
const queryId = ref('')
const config = {
  showHeader: true,
  boder: false,
  pagination: false
}
let data = [
  {type: 'single', description: '检验学生对所学知识的掌握程度和辨别分析能力，题干在设问上多种多样，选项往往似是而非，迷惑性较强'},
  {type: 'multiple', description: '检验学生对所学知识的掌握程度和辨别分析能力，题干在选项处多种多样，或者相似但是有些不同，迷惑性强'},
  {type: 'blank', description: '先给出已知条件，在而后的语句中空出要问的答案以横线代替，以此要求应试者填上正确解'},
  {type: 'code', description: '给出实际的编程问题，需要应试者选择对应的编程语言编写代码解决'},
  {type: 'mind', description: '给出相对于较为发散的问题，充分考察应试者的思维发散能力'},
]
// 定义页面布局
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const getExamInfo = async (Id: number) => {
  const {result, sums}= await httpGet(`/api/examList?id=${Id}`)
  const {createAt, id, ...res} = result
  form.value = res;
}
const handleSave = async () => {
  const data = form.value
  if(!data.paperName || !data.paperCode || !data.startTime || !data.endTime) {
    Message.error('请提供必需的试卷信息')
    return;
  } 
  const query = route.query
  if(query.id) data.id = parseInt(query.id as string)
  const res = await httpPost('/api/examsave', data)
  if(res.ok) {
    Message.success('试卷信息保存成功!')
    router.replace('/adminer/exam')
  } else {
    Message.error('试卷信息保存失败!')
  }
}
onMounted(() => {
  const query = route.query;
  if(query.id) {
    getExamInfo(parseInt(query.id as string))
    queryId.value = query.id as string
  }
})
</script>

<style scoped>
.card {
  border-radius: 8px;
  background: #ffffff;
  box-shadow:  6px 6px 12px #cccccc,
             -6px -6px 12px #ffffff;
}
</style>

