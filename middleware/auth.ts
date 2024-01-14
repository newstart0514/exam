import { Message } from '@arco-design/web-vue';

export default defineNuxtRouteMiddleware((to, from) => {
    const useToken = useCookie('token')
    if(!useToken.value) {
        Message.warning('未登录，正在前往登录')
        return navigateTo(`/login?callback=${to.fullPath}`)
    }
})