<template>
    <div style="margin: 1rem 2rem;">
      <a-card
        class="card"
        title="题目详情"
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
        <a-table
          :data="data"
          row-key="id"
          :bordered="{cell:true}"
          :pagination="false"
          :row-selection="rowSelection"
          v-model:selectedKeys="selectedKeys"
          hoverable
          sticky-header
          stripe
          show-header
        >
          <template #columns>
            <a-table-column title="题目ID" data-index="id" align="center" :width="80"></a-table-column>
            <a-table-column title="题目标题" data-index="qaTitle" align="center"></a-table-column>
            <a-table-column title="题目标签"  align="center" :width="250">
              <template #cell="{ record }">
                <span>{{ record.qaDesc }}</span>
              </template>
            </a-table-column>
            <a-table-column title="题目分数" data-index="score" align="center" :width="100"></a-table-column>
          </template>
        </a-table>
        <div style="display: flex;justify-content: end;margin-top: 0.75rem;">
          <a-pagination 
            :total="pagination.total"
            :current="pagination.current"
            :page-size="pagination.pageSize"
            :page-size-options="[10, 20, 50, 100, 200]"
            size="small" 
            show-total 
            show-page-size 
            @change="handlePage"
            @page-size-change="handlePageSize"
          />
        </div>
      </a-card>
    </div>
  </template>
  
<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';

const pagination = ref({
  total: 10,
  current: 1,
  pageSize: 10
})
const route = useRoute()
const router = useRouter()
const data = ref([])
const selectedKeys = ref([])
let selected = [];
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})
  
// 定义页面布局
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
const getQuestions = async (type: string) => {
  const {result, sums}= await httpGet(`/api/questionList?type=${type}`)
  data.value = result
}
const getSelected = async (id: number) => {
  const {result, sums}= await httpGet(`/api/link?id=${id}&page=${pagination.value.current}&size=${pagination.value.pageSize}`)
  selectedKeys.value = result.questions.map(item => item.question.id)
  selected = result.questions.map(item => item.question.id)
}
const handlePage = (page: number) => {
  const query = route.query;
  pagination.value.current = page
  getQuestions(query.type as string)
}
const handlePageSize = (pageSize: number) => {
  const query = route.query;
  pagination.value.pageSize = pageSize
  getQuestions(query.type as string)
}
const handleSave = async () => {
  const add = []
  const reduce = []
  const oldSet = new Set(selected)
  const newSet = new Set(selectedKeys.value)
  for(let item1 of selectedKeys.value) {
    if(!oldSet.has(item1)) {
      add.push(item1)
    }
  }
  for(let item2 of selected) {
    if(!newSet.has(item2)) {
      reduce.push(item2)
    }
  }

  const testPaperId = parseInt(route.query.id as string)
  let flag = true
  for(let item3 of add) {
    const postData = {
      testPaperId,
      questionId: item3
    }
    const {ok, data} = await httpPost('/api/linkAdd', postData)
    if(!ok) {
      flag = false
    }
  }
  for(let item4 of reduce) {
    const postData = {
      testPaperId,
      questionId: item4
    }
    const {ok, data} = await httpPost('/api/linkDelete', postData)
    if(!ok) {
      flag = false
    } 
  }
  if(flag) {
    const id = route.query.id
    Message.success('保存成功!')
    navigateTo(`/adminer/examDetail?id=${id}`)
  } else {
    Message.error('保存失败!')
  }
}
onMounted(() => {
    const query = route.query;
    if(query.type) {
      getQuestions(query.type as string)
    }
    if(!query.id) {
      Message.error('获取试卷信息有误，请回到试卷页面重新选取')
    } else {
      getSelected(parseInt(query.id as string))
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