<template>
  <div style="margin: 1rem 2rem">
    <a-card class="card" title="招聘方列表" :bordered="false">
      <template #extra>
        <a-button type="text" status="success" @click="handleClick">
          <template #icon>
            <icon-plus />
          </template>
          添加用户
        </a-button>
      </template>
      <a-table
        :data="data"
        :bordered="{ cell: true }"
        :pagination="false"
        hoverable
        sticky-header
        stripe
        show-header
      >
        <template #columns>
          <a-table-column
            title="用户ID"
            data-index="id"
            align="center"
            :width="80"
          ></a-table-column>
          <a-table-column
            title="用户账号"
            data-index="name"
            align="center"
          ></a-table-column>
          <a-table-column
            title="学号"
            data-index="studentId"
            align="center"
          ></a-table-column>
          <a-table-column
            title="邮箱"
            data-index="email"
            align="center"
          ></a-table-column>
          <a-table-column
            title="手机号码"
            data-index="phone"
            align="center"
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
    <a-modal v-model:visible="visible" title="招聘方账号编辑" simple>
      <a-form :model="form">
        <a-form-item field="name" label="用户账号">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="studentId" label="学号">
          <a-input v-model="form.studentId" />
        </a-form-item>
        <a-form-item field="from" label="部门">
          <a-input v-model="form.from" />
        </a-form-item>
        <a-form-item field="phone" label="手机号">
          <a-input v-model="form.phone" />
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input v-model="form.email" />
        </a-form-item>
        <a-form-item field="password" label="用户密码">
          <a-input v-model="form.password" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { Message } from "@arco-design/web-vue";

const route = useRoute();
let data = ref([]);
const pagination = ref({
  total: 10,
  current: 1,
  pageSize: 10,
});
const visible = ref(false);
const form = ref({
  name: "",
  password: "",
  phone: "",
  studentId: "",
  email: "",
  from: "",
});
// 定义页面布局
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const handleClick = () => {
  form.value = {
    name: "",
    password: "",
    phone: "",
    studentId: "",
    email: "",
    from: "",
  };
  visible.value = true;
};
const handleSave = async () => {
  const fromData = form.value;
  fromData.isInterviewer = true;
  const { ok, data } = await httpPost("/api/userSave", fromData);
  if (ok) {
    Message.success("招聘方信息已保存!");
  }
  getList();
  visible.value = false;
};
const getList = async () => {
  const { result, sums } = await httpGet(
    `/api/userList?page=${pagination.value.current}&size=${pagination.value.pageSize}`,
  );
  data.value = result;
  pagination.value.total = sums;
};
function handleEdit(rows) {
  form.value = rows;
  visible.value = true;
}

async function handleDelete(id: number) {
  const res = await httpPost("/api/userDelete", id);
  if (res.ok) {
    Message.success("账号删除成功!");
    getList();
  } else {
    Message.error("账号删除失败!");
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
