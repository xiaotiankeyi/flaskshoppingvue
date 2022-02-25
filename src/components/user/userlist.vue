<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              @blur="sendfind"
              @keyup.enter.native="sendfind"
              clearable
              @clear="sendfind"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="sendfind"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="el-addUser"
              @click="clickCreateUser()"
              plain
              >增加用户</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="id" label="编号"></el-table-column>
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="phone" label="电话"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="address" label="地址"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column prop="handle" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="editUserInfo(scope.row)"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                  <el-button
                    size="mini"
                    type="info"
                    @click="showPwdview(scope.row)"
                    icon="el-icon-refresh"
                    circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="queryInfo.pnumsize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalpage"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 增加用户窗口 -->
    <el-dialog
      title="注册新用户"
      :visible.sync="dialogFormVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRule">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-col :span="15"
            ><el-input v-model="form.username" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-col :span="15"
            ><el-input v-model="form.password" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="确认密码"
          :label-width="formLabelWidth"
          prop="assertPwd"
        >
          <el-col :span="15"
            ><el-input v-model="form.assertPwd" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="手机号码"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-col :span="15"
            ><el-input v-model="form.phone" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="电子邮箱"
          :label-width="formLabelWidth"
          prop="email"
        >
          <el-col :span="15"
            ><el-input v-model="form.email" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="联系地址"
          :label-width="formLabelWidth"
          prop="address"
        >
          <el-col :span="10">
            <el-select v-model="form.address" placeholder="请选择区域">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          label="用户角色"
          :label-width="formLabelWidth"
          prop="role_name"
        >
          <el-col :span="10">
            <el-select v-model="form.role_name" placeholder="请选择角色">
              <el-option
                v-for="item in Roleoptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addUserRequest('formRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑用户窗口 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="EditdialogVisible"
      width="40%"
      :before-close="EdithandleClose"
    >
      <el-form ref="EditformRef" :model="Editform" :rules="EditformRule">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-col :span="15"
            ><el-input
              v-model="Editform.name"
              autocomplete="off"
              :disabled="true"
            ></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="手机号码"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-col :span="15"
            ><el-input v-model="Editform.phone" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="电子邮箱"
          :label-width="formLabelWidth"
          prop="email"
        >
          <el-col :span="15"
            ><el-input v-model="Editform.email" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="联系地址"
          :label-width="formLabelWidth"
          prop="address"
        >
          <el-col :span="10">
            <el-select v-model="Editform.address" placeholder="请选择区域">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          label="用户角色"
          :label-width="formLabelWidth"
          prop="role_name"
        >
          <el-col :span="10">
            <el-select v-model="Editform.role_name" placeholder="请选择角色">
              <el-option
                v-for="item in Roleoptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EdithandleClose">取 消</el-button>
        <el-button type="primary" @click="EditUserRequest('formRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除用户窗口 -->
    <el-dialog
      title="删除用户信息"
      :visible.sync="deldialogVisible"
      width="40%"
      :before-close="delhandleClose"
    >
      <span class="confiy-del"
        >确认是否删除用户"{{ this.delUserInfo.username }}"</span
      >
      <div slot="footer" class="dialog-footer">
        <el-button @click="delhandleClose">取 消</el-button>
        <el-button type="primary" @click="delUserRequest()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户密码重置窗口 -->
    <el-dialog
      title="修改用户密码"
      :visible.sync="PwddialogVisible"
      width="40%"
      :before-close="pwdhandleClose"
    >
      <span>正在修改"{{ userNameInfo }}"的密码</span>
      <el-form ref="pwdformRef" :model="pwdform" :rules="pwdformRule">
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-col :span="15"
            ><el-input v-model="pwdform.password" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item
          label="确认密码"
          :label-width="formLabelWidth"
          prop="assertPwd"
        >
          <el-col :span="15"
            ><el-input v-model="pwdform.assertPwd" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdhandleClose">取 消</el-button>
        <el-button type="primary" @click="pwdUserRequest()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义确认密码验证规则
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value !== this.pwdform.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    const validatephone = (rule, value, callback) => {
      // 自定义正则表达式验证电话号码
      // console.log(value)
      var phoneReg =
        /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    return {
      tableData: [],
      // 这是传递参数关键字,定义了发送给后端搜索对象和第几页,每页显示多少数据
      queryInfo: {
        query: '',
        pnum: 1,
        pnumsize: 10,
      },
      // 数据总数
      totalpage: 0,
      // 判断实时的数据是否显示
      isShow: false,
      // 弹窗默认false
      dialogFormVisible: false,
      formLabelWidth: '90px',
      // 定义提交的数据
      form: {
        username: '',
        password: '',
        assertPwd: '',
        phone: '',
        email: '',
        address: '',
        role_name: '',
      },
      // 定义验证规则和自定义验证规则
      formRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '用户名长度在2到20个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '用户密码长度在6至16个字符之间',
            trigger: 'blur',
          },
        ],
        assertPwd: [
          { required: true, message: '请输入用户确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatephone, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] },
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'change' },
        ],
        role_name: [
          { required: true, message: '角色不能为空', trigger: 'change' },
        ],
      },
      // 定义地址数据
      options: [
        { id: 1, label: '上海', value: '上海' },
        { id: 2, label: '北京', value: '北京' },
        { id: 3, label: '深圳', value: '深圳' },
        { id: 4, label: '广州', value: '广州' },
        { id: 5, label: '天津', value: '天津' },
        { id: 6, label: '南昌', value: '南昌' },
        { id: 7, label: '香港', value: '香港' },
      ],
      // 获取角色列表
      Roleoptions: [],
      // 修改用户信息代码内容
      EditdialogVisible: false,
      Editform: {},
      EditformRule: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatephone, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] },
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'change' },
        ],
        role_name: [
          { required: true, message: '角色不能为空', trigger: 'change' },
        ],
      },
      // 删除用户代码内容
      deldialogVisible: false,
      // 需要删除的用户的信息
      delUserInfo: {
        id: '',
        username: '',
      },
      // 重置密码代码内容
      userNameInfo: '',
      PwddialogVisible: false,
      pwdform: {
        id: '',
        password: '',
        assertPwd: '',
      },
      pwdformRule: {
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '用户密码长度在6至16个字符之间',
            trigger: 'blur',
          },
        ],
        assertPwd: [
          { required: true, message: '请输入用户确认密码', trigger: 'blur' },
          { validator: validatePass3, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('/menu/autolist/')
      console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.Roleoptions = res.data
      console.log(this.Roleoptions)
    },
    // 点击增加用户
    clickCreateUser() {
      this.dialogFormVisible = true
      this.getRoleList()
    },
    async getUserList() {
      // 发送get请求时用 { params: this.queryInfo }
      const { data: res } = await this.$http.get('/user/user_list/', {
        params: this.queryInfo,
      })
      // console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      // 获取总页数
      this.totalpage = res.data.totapage
      // 获取返回页中的数据
      this.tableData = res.data.userlist
    },
    handleSizeChange(val) {
      // 每条/页
      this.queryInfo.pnumsize = val
      // console.log('1', val)
      this.getUserList()
    },
    handleCurrentChange(val) {
      // 当前第几页
      this.queryInfo.pnum = val
      // console.log(val)
      this.getUserList()
    },
    sendfind() {
      // 使搜索时,始终从第一页开始搜索
      this.queryInfo.pnum = 1
      this.getUserList()
    },
    handleClose() {
      // 关闭窗口时重置表单内的值
      this.$refs.formRef.resetFields()
      this.dialogFormVisible = false
    },
    addUserRequest() {
      this.$refs.formRef.validate(async (value) => {
        if (!value) return
        const { data: res } = await this.$http.post(
          '/user/register/',
          this.$qs.stringify(this.form)
        )
        console.log(res)
        if (res.status !== 10000) return this.$msg.error(res.message)
        this.$msg.success(res.message)
        // 提交成功后,重置数据关闭窗口并刷新页面
        this.handleClose()
        this.getUserList()
      })
    },
    // 修改用户信息代码内容
    async editUserInfo(value) {
      // console.log(value) 点击编辑按钮先发送请求获取单个用户的信息在赋值在input
      const { data: res } = await this.$http.get('/user/roleInfo/', {
        params: { id: value.id },
      })
      if (res.status !== 10000) return this.$msg.error(res.message)
      // console.log(res)
      // 获取角色列表
      this.getRoleList()
      // 获取当前用户信息
      this.Editform = res.data
      this.EditdialogVisible = true
    },
    EdithandleClose() {
      // 点击关闭和取消
      this.$refs.EditformRef.resetFields()
      this.EditdialogVisible = false
    },
    EditUserRequest() {
      // validate方式验证作用,验证成功,发送请求,处理响应
      this.$refs.EditformRef.validate(async (value) => {
        if (!value) return
        // const { data: res } = await this.$http.put('/user/alterUser/', this.$qs.stringify(this.Editform))
        const { data: res } = await this.$http.put('/user/alterUser/', {
          id: this.Editform.id,
          phone: this.Editform.phone,
          email: this.Editform.email,
          address: this.Editform.address,
          role_name: this.Editform.role_name,
        })
        // console.log(res)
        if (res.status !== 10000) return this.$msg.error(res.message)
        this.$msg.success(res.message)
        // 提交成功后,重置数据关闭窗口并刷新页面
        this.EdithandleClose()
        // 修改成功后刷新列表
        this.getUserList()
      })
    },
    // 删除用户信息代码部分
    handleDelete(value) {
      // console.log(value)
      this.deldialogVisible = true
      this.delUserInfo.id = value.id
      this.delUserInfo.username = value.name
    },
    delhandleClose() {
      this.deldialogVisible = false
    },
    async delUserRequest() {
      // console.log(this.delUserInfo.id)
      const { data: res } = await this.$http.delete('/user/deleteUser/', {
        data: { id: this.delUserInfo.id },
      })

      if (res.status !== 10000) return this.$msg.error(res.message)
      this.$msg.success(res.message)
      this.delhandleClose()
      this.getUserList()
    },
    // 重置密码功能代码内容
    showPwdview(value) {
      // 显示窗口
      this.userNameInfo = value.name
      this.pwdform.id = value.id
      this.PwddialogVisible = true
    },
    pwdhandleClose() {
      // 关闭取消窗口
      this.$refs.pwdformRef.resetFields()
      this.PwddialogVisible = false
    },
    async pwdUserRequest() {
      console.log(this.pwdform)
      const { data: res } = await this.$http.put(
        '/user/alterPassword/',
        this.$qs.stringify(this.pwdform)
      )
      // console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.$msg.success(res.message)
      this.pwdhandleClose()
    },
  },
}
</script>
<style>
.el-table {
  margin-top: 10px;
}
.el-table {
  left: 20px;
}
.confiy-del {
  color: red;
  font-size: 22px;
}
</style>
