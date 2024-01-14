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
      <a-form 
        :model="form" 
        auto-label-width
        style="margin: 0 -0.25rem;"
      >
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item field="qaType" label="题目类型">
              <a-select :style="{width:'320px'}" placeholder="请选择..." v-model="form.qaType">
                <a-option v-for="(item, index) in questionName" :key="index" :value="index">{{ item }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="score" label="题目分值">
              <a-input :style="{width:'320px'}" placeholder="请输入分数..." v-model="form.score" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item field="qaTitle" label="题目内容">
              <edit :text="form.qaTitle" @update="handleEdit" style="height: 50vh;width: 100%;" v-if="showEdit"></edit>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item field="answer" label="题目答案">
              <edit :text="form.answer" @update="handleEditor" style="height: 50vh;width: 100%;" v-if="showEdit"></edit>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item 
          field="qaContent" 
          label="题目选项" 
          :content-flex="false"
          v-show="form.qaType === 'single' || form.qaType === 'multiple'"
        >
          <div v-for="modal of modals" :key="modal" class="mb">
            <a-row :gutter="0">
              <a-col :span="24">
                <a-tag
                  class="mr"
                  color="red"
                  closable
                  @close="modalsRemove(modal)"
                >
                  {{ modal }}
                </a-tag>
              </a-col>
            </a-row>
          </div>
          
          <a-input
            v-if="showInput1"
            ref="modalRef"
            :style="{ width: '200px'}"
            size="mini"
            v-model.trim="inputVal1"
            @keyup.enter="modalsAdd"
            @blur="modalsAdd"
          />
          <a-tag
            v-else
            color="orangered"
            :style="{
              width: '200px',
              border: '1px dashed var(--color-fill-3)',
              cursor: 'pointer',
            }"
            @click="modalsEdit"
          >
            <template #icon>
              <icon-plus />
            </template>
            添加选项(选项前无需添加序号)
          </a-tag>
        </a-form-item>
        <a-form-item field="paperName" label="题目标签">
            <a-row :gutter="0">
              <a-col :span="24">
                <a-tag
                  class="mr"
                  color="gray"
                  v-for="tag of tags"
                  :key="tag"
                  closable
                  @close="tagRemove(tag)"
                >
                  {{ tag }}
                </a-tag>

                <a-input
                  v-if="showInput2"
                  ref="tagRef"
                  :style="{ width: '200px'}"
                  size="mini"
                  v-model.trim="inputVal2"
                  @keyup.enter="tagAdd"
                  @blur="tagAdd"
                />
                <a-tag
                  v-else
                  color="cyan"
                  :style="{
                    width: '90px',
                    border: '1px dashed var(--color-fill-3)',
                    cursor: 'pointer',
                  }"
                  @click="tagsEdit"
                >
                  <template #icon>
                    <icon-plus />
                  </template>
                  添加标签
                </a-tag>
              </a-col>
            </a-row>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';

const route = useRoute()
const router = useRouter()
const form = ref({
  qaType: '',
  qaTitle: '',
  qaContent: '',
  qaDesc: '',
  score: '',
  answer: ''
})
// 定义页面布局
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const modals = ref([]);
const tags = ref([]);
const modalRef = ref(null);
const tagRef = ref(null)
const showInput1 = ref(false);
const showInput2 = ref(false);
const inputVal1 = ref('');
const inputVal2 = ref('')
const showEdit = ref(false)

const modalsEdit = () => {
  showInput1.value = true;
  nextTick(() => {
    if (modalRef.value) {
      modalRef.value.focus();
    }
  });
};
const modalsAdd = () => {
  if (inputVal1.value) {
    modals.value.push(inputVal1.value);
    inputVal1.value = '';
  }
  showInput1.value = false;
};
const modalsRemove = (key) => {
  modals.value = modals.value.filter((tag) => tag !== key);
};
const tagsEdit = () => {
  showInput2.value = true;
  nextTick(() => {
    if (tagRef.value) {
      tagRef.value.focus();
    }
  });
};
const tagAdd = () => {
  if (inputVal2.value) {
    tags.value.push(inputVal2.value);
    inputVal2.value = '';
  }
  showInput2.value = false;
};
const tagRemove = (key) => {
  tags.value = tags.value.filter((tag) => tag !== key);
};
const getExamInfo = async (Id: number) => {
  const {result, sums, answer}= await httpGet(`/api/questionList?id=${Id}`)
  const {createAt, id, ...res} = result
  form.value = res;
  if(answer) form.value.answer = answer.answer
  if(res.qaContent) modals.value = res.qaContent.split('\r\n')
  if(res.qaDesc) tags.value = res.qaDesc.split('\r\n')
  showEdit.value = true
}
const handleSave = async () => {
  const data = form.value
  data.qaDesc = tags.value.join('\r\n')
  data.qaContent = modals.value.join('\r\n')
  data.score = parseInt(data.score)
  const query = route.query
  if(query.id) data.id = parseInt(query.id as string)
  const res = await httpPost('/api/questionSave', data)
  if(res.ok) {
    Message.success('试题信息保存成功!')
    router.replace('/adminer/question')
  } else {
    Message.error('试题信息保存失败!')
  }
}
const handleEdit = (e) => {
  form.value.qaTitle = e
}
const handleEditor = (e) => {
  form.value.answer = e
}
onMounted(() => {
  const query = route.query;
  if(query.id) {
    getExamInfo(parseInt(query.id as string))
  } else {
    showEdit.value = true
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

