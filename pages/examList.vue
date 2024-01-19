<template>
  <div class="mt ml mr">
    <div>
      <a-button shape="round" @click="back" style="font-size: 24px">
        <template #icon>
          <icon-left />
        </template>
      </a-button>
      <span class="title">考试场次</span>
      <span style="float: right; margin-right: 0.5rem"
        ><time-cur></time-cur
      ></span>
    </div>
    <a-divider></a-divider>
    <div v-if="showRes" style="height: calc(60vh + 7.5rem)">
      <div v-for="item in data" :key="item.id">
        <exam-card :val="item"></exam-card>
      </div>
    </div>
    <a-result
      status="404"
      subtitle="没有找到考试，请您和管理员确认考试是否已经被成功添加"
      style="height: calc(60vh + 7.5rem)"
      v-else
    >
      <template #extra>
        <!-- <a-space>
            <a-button type="primary">Back</a-button>
          </a-space> -->
      </template>
    </a-result>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-button
          shape="round"
          status="danger"
          style="margin-left: 1rem; color: black"
          @click="pageChange('reduce')"
          :disabled="page === 1"
          >上一页</a-button
        >
      </a-col>
      <a-col :span="8">
        <div class="pageInfo">当前第{{ page }}页，共计{{ count }}场考试</div>
      </a-col>
      <a-col :span="8">
        <a-button
          shape="round"
          status="danger"
          style="float: right; color: black; margin-right: 1rem"
          @click="pageChange('add')"
          :disabled="Math.ceil(count / 3) === page"
          >下一页</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
let data = ref([]);
let showRes = ref(true);
let count = ref(0);
let page = ref(1);

// 定义页面布局
definePageMeta({
  layout: "lrform",
});

const getList = async () => {
  const { result, sums } = await httpGet(
    `/api/exams?page=${page.value}&size=3`,
  );
  data.value = result;
  count.value = sums;
  if (data.value.length === 0) showRes.value = false;
  else showRes.value = true;
};
const pageChange = (method: String) => {
  const pre = page.value;
  if (method === "add") {
    page.value++;
  } else {
    if (page.value > 1) page.value--;
  }
  if (pre !== page.value) {
    getList();
  }
};
const back = () => {
  navigateTo("/");
};
onMounted(() => {
  getList();
});
</script>

<style scoped>
.title {
  font-family: "jinghong";
  font-size: 32px;
}
.pageInfo {
  margin-top: 0.5rem;
  display: grid;
  font-size: 18px;
  justify-content: center;
  font-family: "jinghong";
}
</style>
