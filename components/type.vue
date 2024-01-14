<template>
    <span ref="text" class="msg"></span>
</template>
    
<script setup>
import { ref, onMounted } from "vue";
import TypeIt from 'typeit'
const props = defineProps({ strings: { type:Array } })
const text = ref(null)
onMounted(() => {
    new (TypeIt)(text.value, {
        strings: props.strings,
        cursorChar: "<span class='cursorChar'>|<span>",//用于光标的字符。HTML也可以
        speed: 200,
        lifeLike: true,// 使打字速度不规则
        cursor: false,//在字符串末尾显示闪烁的光标
        breakLines: false,// 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
        loop: false,//是否循环
    }).go()
})
</script>

<style scoped>
.msg {
    font-family: 'jinghong';
    font-weight: bold;
    color: white;
    font-size: 64px;
}
.cursorChar {
    font-size: 16px;
}
</style>