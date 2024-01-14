<template>
  <MdPreview 
    :modelValue="content"
    :showCodeRowNumber="false" 
    previewTheme="default" 
    codeTheme="paraiso"
  />
</template>

<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})
</script>