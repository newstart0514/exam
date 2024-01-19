<template>
  <button :class="['btn', 'choose', classes]" v-if="content">
    <div class="left">
      {{ title }}
    </div>
    <div class="right">
      {{ content }}
    </div>
  </button>
  <button class="btn item" v-else>
    {{ title }}
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const classes = computed(() => {
  return props.active ? "btn-active" : "";
});
</script>

<style scoped>
.btn {
  height: 100%;
  font-size: 16px;
  font-family: "kaiti";
  display: flex;
  align-items: center;
  cursor: pointer;
  border: rgba(128, 128, 128, 0.3) solid 0.5px;
  border-radius: 16px;
}
.choose {
  width: 100%;
  padding: 6px;
  justify-content: space-between;
}
.item {
  min-width: 40px;
  padding: 10px;
  border-radius: 8px;
  justify-content: center;
}
.btn:hover {
  opacity: 0.95;
  background-color: rgba(128, 128, 128, 0.15);
  box-shadow:
    2px 2px 4px #cccccc,
    -2px -2px 4px #cccccc;
}

.btn-active {
  border: rgba(27, 167, 132, 1) solid 2px;
  background-color: rgba(131, 203, 172, 0.4);
  box-shadow:
    1px 1px 2px #cccccc,
    -1px -1px 2px #cccccc;
}
.left {
  min-width: 40px;
  height: 100%;
}
.right {
  width: calc(100% - 40px);
  height: 100%;
  text-align: left;
}
</style>
