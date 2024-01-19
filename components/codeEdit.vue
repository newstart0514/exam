<template>
  <div id="editor" ref="editorRef" style="height: 100%; overflow: auto"></div>
</template>

<script lang="ts" setup>
import * as monaco from "monaco-editor";

const props = defineProps({
  lang: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const editorRef = ref();
const codeEditor = ref();
const codeValue = ref("");
const language = ref("javascript");

onMounted(() => {
  codeValue.value = props.code;
  language.value = props.lang;
  if (!editorRef.value) {
    return;
  }
  // 编辑器设置
  codeEditor.value = monaco.editor.create(editorRef.value, {
    language: props.lang,
    value: codeValue.value,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: false,
    theme: "vs-dark",
    codeLens: true,
    folding: true, // 是否折叠
    roundedSelection: false,
    foldingHighlight: true, // 折叠等高线
    foldingStrategy: "indentation", // 折叠方式  auto | indentation
    showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
    disableLayerHinting: true, // 等宽优化
    emptySelectionClipboard: false, // 空选择剪切板
    selectionClipboard: false, // 选择剪切板
    lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 5, // 行号最小字符   number
    accessibilitySupport: "auto",
  });
  // 监听编辑变化
  codeEditor.value.onDidChangeModelContent(() => {
    console.log("目前内容为：" + toRaw(codeEditor.value).getValue());
    console.log(codeValue.value);
    console.log(props.lang);
  });
});
</script>
