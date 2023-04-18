<template>

  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          src="../assets/heima.png"
          alt="网站Logo"
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        @click="loginOut"
        type="info"
      >退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <!-- 折叠展开设置 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#2878ff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index改为动态的，不然打开一个菜单，另外的全都会打开;index只接受字符串，所以要转成字符串类型 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>

      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- router占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: 'Home',
  data(){
    return {
      //左侧菜单数据
      menuList : [],
      //一级菜单的图表对象
      iconsObj: {
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      //是否折叠
      isCollapse : false,
      //当前激活的二级路径
      activePath:'',

    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginOut() {
      //退出实现原理-清空token，然后重定向到login页面
      //这里比较暴力，直接把sessionStorage全清掉了
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      //判断菜单获取的状态码，确定是否接收到数据
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data//数组
      // console.log(res)
    },

    //折叠/展开左侧菜单区域
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },

    //保存链接的激活状态
    //保存当前打开的二级菜单名，存到sessionStorage中，便于给它加高亮效果
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
//element-ui中的标签名也是其类名
.el-header {
  background-color: #373d41;
  display: flex; //左右贴边对齐
  justify-content: space-between; //左右贴边对齐
  padding-left: 0; //图标贴左
  align-items: center; //按钮居中
  color: #fff;
  font-size: 20px;
  > div {
    //嵌套书写代码，内部也用flex布局，实现垂直居中效果
    display: flex;
    align-items: center;
    span {
      margin-left: 15px; //给文字设一下左margin
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;//解决右侧边框对不齐的问题
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #475163;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>