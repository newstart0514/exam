<template>
  <div style="margin: 1rem 2rem;">
    <a-card
      class="card"
      title="试卷列表"
      :bordered="false"
    >
      <template #extra>
        <!-- <a-button type="text" status="success" @click="navigateTo('/adminer/examDetail')">
          <template #icon>
            <icon-plus />
          </template>
          添加试卷
        </a-button> -->
      </template>
      <a-table
        :data="data"
        :bordered="{cell:true}"
        :pagination="false"
        hoverable
        sticky-header
        stripe
        show-header
      >
        <template #columns>
          <a-table-column title="试卷ID" data-index="id" align="center" :width="80"></a-table-column>
          <a-table-column title="试卷名称" data-index="paperName" align="center"></a-table-column>
          <a-table-column title="试卷邀请码" data-index="paperCode" align="center"></a-table-column>
          <a-table-column title="考试开始时间" data-index="startTime" align="center"></a-table-column>
          <a-table-column title="考试结束时间" data-index="endTime" align="center"></a-table-column>
          <a-table-column title="操作" align="center" :width="200">
            <template #cell="{ record }">
              <a-button type="text" status="warning" @click="handleEdit(record)">
                <template #icon>
                  <icon-edit />
                </template>
                编辑
              </a-button>
              <a-button type="text" status="danger" @click="handleDelete(record.id)">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </template>
          </a-table-column>
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

const route = useRoute()
let data = ref([])
const pagination = ref({
    total: 10,
    current: 1,
    pageSize: 10
})
// 定义页面布局
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const getList = async () => {
    const {result, sums} = await httpGet(`/api/examList?page=${pagination.value.current}&size=${pagination.value.pageSize}`)
    data.value = result
    pagination.value.total = sums
}
function handleEdit(rows) {
    navigateTo(`/adminer/examDetail?id=${rows.id}`)
}
async function handleDelete(id: number) {
    const res = await httpPost('/api/examDelete', id)
    if(res.ok) {
        Message.success('试卷删除成功!')
        getList()
    } else {
        Message.error('试卷删除失败!')
    }
}
const handlePage = (page: number) => {
    pagination.value.current = page
    getList()
}
const handlePageSize = (pageSize: number) => {
    pagination.value.pageSize = pageSize
    getList()
}
onMounted(() => {
    getList()
});
</script>

<style scoped>
.card {
    border-radius: 8px;
    background: #ffffff;
    box-shadow:  6px 6px 12px #cccccc,
                -6px -6px 12px #ffffff;
}
</style>
  
  