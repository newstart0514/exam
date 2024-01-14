<template>
  <div style="margin: 1rem 2rem;">
    <a-card
      class="card"
      :bordered="false"
    >
      <template #title>
        <!-- 标题 -->
        <span style="font-weight: 600;">试卷详情</span>
        <span class="ml" style="font-size: small;margin-right: 0.2rem;">分数：<a-tag color="gold">{{ userInfo.score }}</a-tag></span>
        <a-dropdown trigger="hover">
          <a-button type="text" status="warning">
            <template #icon>
              <icon-idcard />
            </template>
            考生信息
          </a-button>
          <template #content>
            <div class="pr pl pt pb" style="background-color: transparent;">
              <img src="/xueshihat.png" class="userCardImg"/>
              <div style="margin-bottom: 0.2rem;"><span style="font-weight: 600;">姓名:&nbsp;&nbsp;</span>{{ userInfo.name }}</div>
              <div style="margin-bottom: 0.2rem;"><span style="font-weight: 600;">班级:&nbsp;&nbsp;</span>{{ userInfo.from }}</div>
              <div style="margin-bottom: 0.2rem;"><span style="font-weight: 600;">学号:&nbsp;&nbsp;</span>{{ userInfo.studentId }}</div>
              <div style="margin-bottom: 0.2rem;"><span style="font-weight: 600;">电话:&nbsp;&nbsp;</span>{{ userInfo.phone }}</div>
              <div style="margin-bottom: 0.2rem;"><span style="font-weight: 600;">邮箱:&nbsp;&nbsp;</span>{{ userInfo.email }}</div>
            </div>
          </template>
        </a-dropdown>
      </template>
      <template #extra>
        <!-- 右上角 -->
        <div class="btnRight">
          <a-button-group>
            <a-button type="text">
              <icon-left />
              上一位
            </a-button>
            <a-button type="text">
              下一位
              <icon-right />
            </a-button>
          </a-button-group>
          <a-dropdown>
            <a-button type="text" status="danger">
              <template #icon>
                <icon-down />
              </template>
              试卷结果
            </a-button>
            <template #content>
              <a-doption>
                <template #icon>
                  <icon-close style="color: red"/>
                </template>
                <template #default>
                  <span style="color: red">不通过</span>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <icon-check style="color: green"/>
                </template>
                <template #default>
                  <span style="color: green">通过</span>
                </template>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </template>
      <edit-viewer :content="content" v-if="content" style="height: calc(100vh - 102px - 4rem);overflow: auto;"></edit-viewer>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
// 定义页面布局
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
const route = useRoute()
const router = useRouter()
const query = route.query
const content = ref('')
const userInfo = ref({
  name: '无信息',
  from: '无信息',
  studentId: '无信息',
  email: '无信息',
  phone: '无信息',
  score: '无信息'
})

const getPaper = async () => {
  const postData = {
    userId: parseInt(query.uid as string),
    examId: parseInt(query.eid as string)
  }
  const {ok, data, user} = await httpPost('/api/adminer/exam', postData)
  if(ok) {
    content.value = data
    userInfo.value = user
  }
}

onMounted(() => {
    getPaper()
})
</script>

<style scoped>
.card {
    border-radius: 8px;
    background: #ffffff;
    box-shadow:  6px 6px 12px #cccccc,
                -6px -6px 12px #ffffff;
}
.userCardImg {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  height: 35%;
  opacity: 0.4;
  overflow: hidden;
}
.arco-dropdown-open .arco-icon-down {
  transform: rotate(180deg);
}
.btnRight {
  display: flex;
  right: 0.5rem;
  height: 32px;
}
</style>