<template>
  <div style="margin: 30% 25%;" class="rounded">
    <div class="text-size-4xl mb" style="font-family: 'jinghong';">招聘方登录</div>
    <a-form ref="formRef" :model="model" layout="vertical">
      <a-form-item field="name" label="账号" tooltip="若无账号,可以向网络信息中心提出申请">
        <a-input v-model="model.name" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item field="post" label="密码" tooltip="若忘记密码,请联系网络信息中心">
        <a-input type="password" v-model="model.password" placeholder="请输入密码..." />
      </a-form-item>
      <a-form-item field="isRead">
        <a-checkbox v-model="model.isStore" style="margin-top: -2rem;">
          记住密码
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" status="danger" style="width: 100%;margin-top: -2.5rem;" @click="login">登录</a-button>
      </a-form-item>
      <a-form-item>
        <a-button style="width: 100%;margin-top: -5rem;" @click="back">返回首页</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
// 获取表单实例用于校验
const formRef = ref(null)
// 数据模型
const model = ref({
  name: '',
  password: '',
  isStore: false
})

// 保存登录状态
const store = useUser()
const login = async () => {
  const { ok, data } = await httpPost<IResult>('/api/login', {
    name: model.value.name,
    password: model.value.password,
  })
  if(ok) {
    Message.success('登录成功！欢迎您，' + model.value.name)
    store.userInfo = data
    if(!!(route.query.callback)) {
      navigateTo(route.query.callback);
    } else {
      navigateTo('/')
    }
  }
}

const back = () => {
  navigateTo('/')
}

// 定义页面布局
definePageMeta({
  layout: 'adform'
})

useHead({
  title: '招聘方登录',
})
</script>