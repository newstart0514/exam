<template>
  <MdEditor 
    v-model="editorText" 
    :showCodeRowNumber="false" 
    previewTheme="vuepress" 
    codeTheme="paraiso" 
    :preview="false"
    placeholder="请输入...(支持markdown语法)"
    noUploadImg
    :toolbarsExclude="['pageFullscreen','fullscreen','htmlPreview','github','catalog', 'save']"
    :onChange="handleChange"
  />
</template>

<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const editorText = ref('');
const props = defineProps({
  text: {
    type: String,
    required: true
  }
})
const emit = defineEmits(["update"])

const handleChange = (val: string) => {
  editorText.value = val
  emit("update", val)
}
onMounted(() => {
  editorText.value = props.text
})
</script>