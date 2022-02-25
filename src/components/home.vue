<template>
    <el-container class="page-content">
        <el-header class="head-content">
            <div class="hade-satrt">
                <img class="el-logo" src="../assets/page-logo.png" alt="">
                <span>电子商城后台管理系统</span>
            </div>
            <!-- <el-button type="primary" @click="testExit">Exit</el-button> -->
            <el-button type="primary" @click="loginout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                    :default-active="activePath"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    router>
                    <!-- unique-opened = 'true'> -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                        <i :class="iconlist[item.id +' ']"></i>
                        <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item :index="subleve.path" v-for="subleve in item.subLevel" :key="subleve.id" @click="clickThis">
                            <i :class="iconlist[item.id +' ']"></i>
                            <span>{{ subleve.name }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconlist: {
        '2 ': 'el-icon-user-solid',
        '3 ': 'el-icon-s-tools',
        '4 ': 'el-icon-s-shop',
        '5 ': 'el-icon-s-goods',
        '6 ': 'el-icon-s-data'
      },
      activePath: ''
    }
  },
  // 作用时页面刷新时就执行
  created () {
    this.menuData()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout () {
      // 退出操作,清空token
      window.sessionStorage.removeItem('token')
      // window.sessionStorage.clear()
      this.$router.push('/login/')
      this.$msg.success('退出成功')
    },
    // testExit () {
    //   this.$http.get('user/token/')
    // },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    async menuData () {
      const { data: res } = await this.$http.get('/menu/menulist/?type=not')
      // console.log(res)
      this.menuList = res.data
    },
    clickThis (ap) {
      // console.log(ap)
      window.sessionStorage.setItem('activePath', ap.index)
      this.activePath = ap.index
    }
  }
}
</script>

<style leng='less' scoped>
    .page-content {
        height: 100%;
    }
    .el-header {
        display: flex;
        background-color: #409EFF;
        align-items: center;
        justify-content: space-between;
        color: #F5F7FA;
        font-size: 20px;
    }
    .el-logo {
        height: 100%;
        width: 60px;
        align-items: center;
    }
    .hade-satrt {
        align-items: center;
        display: flex;
    }

    .el-aside {
        background-color: #606266;
    }

    .el-main {
        background-color: #F2F6FC;
    }
</style>
