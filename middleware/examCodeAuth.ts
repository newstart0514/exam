import { Message } from '@arco-design/web-vue'; 

export default defineNuxtRouteMiddleware((to, from) => {
    const codeToken = localStorage.getItem('paperCode')
    if(!codeToken) {
        Message.error('身份检验失败，请输入考试方提供的邀请信息并重新进入考试!')
        return navigateTo('/examList')
    }
})
