<template>
  <div class="card" style="height: 20vh;background-color: transparent;">
    <img :src="cardImgUrl" class="backgroundImg"/> 
    <a-comment :author="obj.paperName" :datetime="date" align="right">
      <template #actions>
        <span style="margin-top: 0.3rem;">
          当前状态:
          <a-tag :color="tagColor">{{ tagText }}</a-tag>
        </span>
        <a-button type="primary" class="action" style="margin-right: 0.5rem;" @click="handlerClick">开始考试</a-button>
      </template>
      <template #avatar>
        <!-- 左部图片区域 -->
      </template>
      <template #content>
        <div v-html="obj.desc"></div>
      </template>
    </a-comment>
    <a-modal v-model:visible="visible" title="身份检查" simple>
      <div style="font-family: 'kaiti';font-weight: 600;font-size: 16px;margin-bottom: 10px;">
        &nbsp;&nbsp;在进入考试之前，我们需要确定您是考试邀请人之一，请您在下方填写考试方提供的进入考试的相关信息。
        如没有相关信息，请咨询考试方。
      </div>
      <a-form :model="form">
        <a-form-item field="code" label="邀请码">
          <a-input v-model="form.code" ref="input1" :error="input1Error"/>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button shape="round" type="primary" @click="handleOk" :loading="okLoading">检查</a-button>
        <a-button shape="round" style="background-color: white !important;" @click="handleCancel">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';

// DOM
const input1 = ref()

const status = ref({
  isTesting: false,
  willTest: false,
  tested: false
})
const okLoading = ref(false)
const props = defineProps({
  val: {
    type: Object,
    default: () => {
      return {
        id: 0,
        paperName: '',
        desc: '',
        startTime: '',
        endTime: ''
      }
    }
  }
})
const obj = props.val
const visible = ref(false);
const input1Error = ref(false)
const form = reactive({
  code: ''
});

const handleOk = async () => {
  if(input1Error.value) input1Error.value = false
  if(!form.code) {
    input1Error.value = true
    input1.value.focus()
    return
  }
  okLoading.value = true
  const {ok, data} = await httpGet(`/api/exam/codeVaild?examId=${obj.id}&code=${form.code}`)
  if(ok) {
    if(data && data.isValid) {
      Message.error('检查错误，请重新输入!')
      form.code = ''
    } else {
      visible.value = false
      Message.success('检查成功，正在进入考试......')
      localStorage.setItem('paperCode', form.code)
      navigateTo(`/personInfo?examId=${obj.id}`)
    }
  } else {
    Message.error('考试出错啦，请联系工作人员解决!')
    visible.value = false
  }
  okLoading.value = false
};
const handleCancel = () => {
  visible.value = false;
}
const timeHandle = (time: String) => {
  const time1 = time.split(' ');
  const time2 = time1[0].split('-');
  return `${time2[0]}年${time2[1]}月${time2[2]}日 ${time1[1]}`;
}
const date = computed(() => {
  return `${timeHandle(obj.startTime)}~${timeHandle(obj.endTime)}`;
})
const tagColor = computed(() => {
  if(status.value.tested) {
    return 'gray'
  } else if(status.value.isTesting) {
    return 'green'
  } else {
    return 'gold'
  }
})
const tagText = computed(() => {
  if(status.value.tested) {
    return '已结束'
  } else if(status.value.isTesting) {
    return '考试中'
  } else {
    return '待考中'
  }
})
const cardImgUrl = computed(() => {
  if(status.value.tested) {
    return '/jiangbei.png'
  } else if(status.value.isTesting) {
    return '/shuxie.png'
  } else {
    return '/naozhong.png'
  }
})
const handlerClick = () => {
  if(status.value.tested) {
    Message.error('考试已结束，暂不可以加入考试，如需补考请联系考试主办方')
    return;
  }
  visible.value = true
}
onMounted(() => {
  const curTime = new Date()
  const start = new Date(obj.startTime)
  const end = new Date(obj.endTime)
  if(curTime < start) {
    status.value.willTest = true
  } else {
    if(curTime > end) {
      status.value.tested = true
    } else {
      status.value.isTesting = true
    }
  }
})
</script>

<style scoped>
.card {
  padding: 0.5rem;
  margin: 0.8rem 0.8rem 1.5rem 0.8rem;
  border-radius: 8px;
  background: #ffffff;
  box-shadow:  6px 6px 12px #cccccc,
             -6px -6px 12px #ffffff;
}
.action {
  display: inline-block;
  padding: 0 8px;
  color: var(--color-text-1);
  line-height: 24px;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.action:hover {
  background: #c04851;
}
.backgroundImg {
  z-index: -1;
  position: absolute;
  height: 21%;
  opacity: 0.4;
  overflow: hidden;
}
</style>