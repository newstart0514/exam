<template>
  <div style="margin: 1rem 2rem;">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card class="cardOuter">
          <div class="card">
            <a-statistic 
              :value="banner.testPaper" 
              :value-from="0" 
              placeholder="0" 
              start 
              animation 
              :value-style="{ color: '#0fbf60', display: 'flex', justifyContent: 'center' }"
            >
              <template #title>
                <div class="cardTitle">
                  <icon-calendar-clock />
                  试卷数量
                </div>
              </template>
            </a-statistic>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="cardOuter">
          <div class="card">
            <a-statistic 
              :value="banner.question" 
              :value-from="0" 
              placeholder="0" 
              start 
              animation 
              :value-style="{ color: '#0fbf60', display: 'flex', justifyContent: 'center' }"
            >
              <template #title>
                <div class="cardTitle">
                  <icon-archive />
                  试题数量
                </div>
              </template>
            </a-statistic>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="cardOuter">
          <div class="card">
            <a-statistic 
              :value="banner.user" 
              :value-from="0" 
              placeholder="0" 
              start 
              animation 
              :value-style="{ color: '#0fbf60', display: 'flex', justifyContent: 'center' }"
            >
              <template #title>
                <div class="cardTitle">
                  <icon-user-group />
                  招聘方数量
                </div>
              </template>
            </a-statistic>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="0" class="mt">
      <a-col :span="24" hoverable>
        <a-card class="cardOuter">
          <template #title>
            <div style="font-weight: 600;">
              发布考试流程
            </div>
          </template>
          <a-row :gutter="16">
            <a-col :span="6">
              <img src="/vector/questionReady.png" style="width: 13rem;"/>
              <div class="description">
                准备试题
              </div>
            </a-col>
            <a-col :span="6">
              <img src="/vector/examReady.png" style="width: 13rem;"/>
              <div class="description">
                准备试卷
              </div>
            </a-col>
            <a-col :span="6">
              <img src="/vector/examPublish.png" style="width: 13rem;"/>
              <div class="description">
                发布考试
              </div>
            </a-col>
            <a-col :span="6">
              <img src="/vector/examFinish.png" style="width: 13rem;"/>
              <div class="description">
                考试完毕
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="0" class="mt">
      <a-col :span="24" hoverable>
        <a-card class="cardOuter">
          <template #title>
            <div style="font-weight: 600;">
              快捷入口
            </div>
          </template>
          <div class="btnGroup">
            <a-button type="text" status="danger" @click="navigateTo('/adminer/paper')">我要阅卷</a-button>
            <a-button type="text" status="danger" @click="navigateTo('/adminer/question')">我要添加试题</a-button>
            <a-button type="text" status="danger" @click="navigateTo('/adminer/exam')">我要发布考试</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
const banner = ref({
  testPaper: 0,
  question: 0,
  user: 0
})
// 定义页面布局
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
const getCharts = async () => {
  const {ok, data} = await httpGet('/api/adminer/charts')
  if(ok) {
    banner.value = data
  }
}
onMounted(() => {
  getCharts()
})
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 16px;
}
.cardTitle {
  font-size: 16px;
  font-weight: 600;
}
.cardOuter {
  border-radius: 8px;
  background: #ffffff;
  box-shadow:  6px 6px 12px #cccccc,
             -6px -6px 12px #ffffff;
}
.description {
  font-size: 14px;
  margin-left: 4.5rem;
  margin-top: -2rem;
}
</style>

