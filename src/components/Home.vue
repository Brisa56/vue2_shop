<template>
    <div>
        <el-button @click="loginOut" type="info">退出</el-button>
    </div>
</template>

<script>
export default {
    name:'Home',
    methods:{
        loginOut(){
            //退出实现原理-清空token，然后重定向到login页面
            //这里比较暴力，直接把sessionStorage全清掉了
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style>

</style>