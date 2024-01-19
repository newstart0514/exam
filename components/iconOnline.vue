<template>
  <icon-font :type="code" :size="size" v-if="props.mode === 'online'" />
  <i :class="['iconfont', code]" v-else-if="props.mode === 'local'"></i>
</template>

<script lang="ts" setup>
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mode: {
    type: String as PropType<iconMode>,
    required: true,
  },
});

import { Icon } from "@arco-design/web-vue";
import type { iconMode } from "~/composables/composable";
const IconFont = Icon.addFromIconFontCn({ src: iconProjectUrl });
</script>
