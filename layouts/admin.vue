<template>
  <a-layout class="layout h-screen w-screen">
    <a-layout-header>
      <adminer-header></adminer-header>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        collapsible
        breakpoint="xl"
        :collapsed="collapsed"
        @collapse="onCollapse"
        theme="dark"
      >
        <a-menu
          :default-open-keys="['/']"
          :default-selected-keys="defalutSelected"
          :style="{ width: '100%' }"
          @menu-item-click="onClickMenuItem"
        >
          <a-menu-item v-for="item in menuInfo" :key="item[0]">
            <template #icon>
              <icon-online
                :code="item[2]"
                :size="14"
                :mode="itemMode"
              ></icon-online>
            </template>
            {{ item[1] }}
          </a-menu-item>
        </a-menu>
        <!-- trigger -->
        <template #trigger="{ collapsed }">
          <IconCaretRight v-if="collapsed"></IconCaretRight>
          <IconCaretLeft v-else></IconCaretLeft>
        </template>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <div
            style="
              height: calc(100vh - 56px);
              display: flex;
              flex-direction: column;
              overflow: auto;
            "
          >
            <slot />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import type { iconMode } from "~/composables/composable";

const collapsed = ref(false);
const route = useRoute();
const defalutSelected = ref(["/"]);
const menuInfo = ref([]);
const itemMode = ref<iconMode>("local");

const onCollapse = (val, type) => {
  collapsed.value = val;
};
const onClickMenuItem = (key) => {
  navigateTo(`/adminer${key}`);
};
const isUrlAlive = async () => {
  const res = await urlAlive(iconProjectUrl);
  if (res) itemMode.value = "online";
};
onMounted(() => {
  selected();
  getMenu();
  isUrlAlive();
});
const selected = () => {
  const pathArr = route.path.split("/");
  if (pathArr.length > 2) {
    defalutSelected.value[0] = `/${pathArr[2]}`;
  }
};
const getMenu = async () => {
  const { ok, data } = await httpGet("/api/adminer/menuList");
  if (ok) {
    menuInfo.value = data;
  }
};
</script>

<style scoped>
.layout {
  background: var(--color-fill-2);
}
.layout :deep(.arco-layout-header) {
  height: 48px;
  line-height: 48px;
  background: rgba(48, 48, 48, 1);
}
.layout :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: rgba(128, 128, 128, 0.1);
}
.layout :deep(.arco-layout-footer),
.layout :deep(.arco-layout-content) {
  /* display: flex; */
  flex-direction: column;
  /* justify-content: center; */
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  /* text-align: center; */
}
</style>
