<template>
  <div style="margin: 1rem 2rem">
    <a-card class="card" title="题目列表" :bordered="false">
      <template #extra>
        <a-button
          type="text"
          status="success"
          @click="navigateTo('/adminer/questionDetail')"
        >
          <template #icon>
            <icon-plus />
          </template>
          添加题目
        </a-button>
      </template>
      <a-table
        :data="data"
        :bordered="{ cell: true }"
        page-position="bottom"
        :pagination="false"
        hoverable
        sticky-header
        stripe
        show-header
      >
        <template #columns>
          <a-table-column
            title="题目ID"
            data-index="id"
            align="center"
            :width="80"
          ></a-table-column>
          <a-table-column
            title="题目"
            data-index="qaTitle"
            align="center"
            :width="600"
            ellipsis
            tooltip
          ></a-table-column>
          <a-table-column title="题目类型" align="center" :width="120">
            <template #cell="{ record }">
              <span>{{ questionName[record.qaType] }}</span>
            </template>
          </a-table-column>
          <a-table-column
            title="题目分数"
            data-index="score"
            align="center"
            :width="100"
          ></a-table-column>
          <a-table-column title="操作" align="center" :width="200">
            <template #cell="{ record }">
              <a-button
                type="text"
                status="warning"
                @click="handleEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                编辑
              </a-button>
              <a-button
                type="text"
                status="danger"
                @click="handleDelete(record.id)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <div style="display: flex; justify-content: end; margin-top: 0.75rem">
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
import { Message } from "@arco-design/web-vue";

let data = ref([]);
const pagination = ref({
  total: 10,
  current: 1,
  pageSize: 10,
});
// 定义页面布局
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const getList = async () => {
  const { result, sums } = await httpGet(
    `/api/questionList?page=${pagination.value.current}&size=${pagination.value.pageSize}`,
  );
  data.value = result;
  pagination.value.total = sums;
};
function handleEdit(rows) {
  navigateTo(`/adminer/questionDetail?id=${rows.id}`);
}
async function handleDelete(id: number) {
  const res = await httpPost("/api/questionDelete", id);
  if (res.ok) {
    Message.success("试题删除成功!");
    getList();
  } else {
    Message.error("试题删除失败!");
  }
}
const handlePage = (page: number) => {
  pagination.value.current = page;
  getList();
};
const handlePageSize = (pageSize: number) => {
  pagination.value.pageSize = pageSize;
  getList();
};
onMounted(() => {
  getList();
});
</script>

<style scoped>
.card {
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    6px 6px 12px #cccccc,
    -6px -6px 12px #ffffff;
}
</style>
