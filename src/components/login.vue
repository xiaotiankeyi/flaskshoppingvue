<template>
  <div class="login_page">
      <div class="login_content">
            <div class="project_logo">
                <img src="../assets/logo.jpg" alt="">
            </div>
            <el-form :model="ruleForm" :rules="loginrules" ref="clsForm" class="demo_Form">
                <el-form-item prop="username">
                    <el-input type="text" v-model="ruleForm.username" prefix-icon="el-icon-s-custom" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input show-password v-model="ruleForm.password" prefix-icon="el-icon-lock" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item class="botton_element">
                    <el-button type="primary" @click="submitForm('clsForm')">提交</el-button>
                    <el-button type="primary" @click="resetForm('clsForm')">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      loginrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 50, message: '用户名长度在2到20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      // console.log(this)
      this.$refs.clsForm.resetFields()
    },
    submitForm () {
      // console.log(this)
      this.$refs.clsForm.validate(async (valid) => {
        // console.log(valid)
        if (!valid) {
          // 验证不通过处理
          return false
        }
        // async加上await设置为同步发送
        const { data: res } = await this.$http.post('/user/login/', this.$qs.stringify(this.ruleForm))
        // console.log(res)
        if (res.status === 10000) {
          // 登录成功把token保存在本地并提示且跳转页面
          window.sessionStorage.setItem('token', res.data.token)
          this.$msg.success(res.message)
          this.$router.push('/home')
          return true
        } else {
          this.$msg.error(res.message)
          return false
        }
      })
    }
  }
}
</script>

<!-- scoped只针对于当前组件,避免冲突,lang='less',指定css语法格式 -->
<style leng='less' scoped>
    .login_page {
        background-color: #e0e4e8;
        height: 100%;
    }
    .login_content {
        height: 520px;
        width: 400px;
        border-radius: 4px;
        background-color: #fff;
        /* position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%); */
        position: fixed;
        left: 50%;
        top: 70px;
        transform: translateX(-50%);
    }
    .project_logo {
        height: 65px;
        width: 240px;
        /* border: 1px solid green; */
        position: absolute;
        left: 80px;
        top: 20px;
    }
    .project_logo>img {
            height: 100%;
            width: 100%;
        }
    .demo_Form {
        /* border: 1px solid black; */
        position: absolute;
        top: 160px;
        width: 100%;
        padding: 0 15%;
        box-sizing: border-box;
    }
    .botton_element {
        display: flex;
        justify-content: flex-end;
    }

</style>
