<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods_list' }"
        >商品列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>创建商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="创建商品详情页面" type="info" center show-icon></el-alert>
    <el-card>
      <!-- 步骤ui和form表单 -->

      <el-steps :active="active - 0" finish-status="success">
        <el-step title="步骤 1" description="基本信息"> </el-step>
        <el-step title="步骤 2" description="商品动态信息"></el-step>
        <el-step title="步骤 3" description="商品静态信息"></el-step>
        <el-step title="步骤 3" description="商品图片"></el-step>
        <el-step title="步骤 3" description="商品内容"></el-step>
        <el-step title="步骤 3" description="完成"></el-step>
      </el-steps>
      <!-- 添加内容块 -->

      <el-form
        :model="addform"
        ref="addref"
        :rules="addrules"
        label-width="80px"
        class="demo-addform"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="active"
          :before-leave="beforeleave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addform.name"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="info">
              <el-input v-model="addform.info"></el-input>
            </el-form-item>
            <el-form-item label="商品单价" prop="price">
              <el-input v-model="addform.price"></el-input>
            </el-form-item>
            <el-form-item label="商品库存" prop="repertory">
              <el-input v-model="addform.repertory"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="number"
                :options="options"
                :props="{
                  expandTrigger: 'hover',
                  value: 'id',
                  children: 'child_node',
                  label: 'name',
                  multiple: false,
                  checkStrictly: true,
                }"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品动态信息" name="1">商品动态信息</el-tab-pane>
          <el-tab-pane label="商品静态信息" name="2">商品静态信息</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="/goods/uploadPictrue"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handlesuccess"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              class="el-editor"
              ref="myQuillEditor"
              v-model="addform.content"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            />
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="30%">
      <img :src="previewUrl" class="el-pictrue" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabPosition: 'left',
      // 表单填写信息
      addform: {
        name: '',
        info: '',
        price: null,
        repertory: null,
        level: 0,
        parentID: 0,
        pictruePath: [],
        content: '',
      },
      // 表单验证信息
      addrules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        info: [{ required: true, message: '请添加商品描述', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品单价', trigger: 'blur' }],
        repertory: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
        ],
      },
      // 获取商品分类,练级分类处理
      number: [],
      options: [],
      // 图片上传
      fileList: [],
      // 预览图片
      previewVisible: false,
      previewUrl: '',
      // 富文本
      editorOption: {},
    }
  },
  created() {
    this.findGoodsclassify()
  },
  methods: {
    async findGoodsclassify() {
      // 获取练级选中器中商品分类数据
      this.dialogTableVisible = true
      const { data: res } = await this.$http.get(
        '/goods/findgoodsify/?find=all&level=2'
      )
      // console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.options = res.data
      // console.log(this.options)
    },
    handleChange(value) {
      // 获取练级选择器中所选参数
      // console.log(this.number)
      if (this.number.length >= 2) {
        // parentID父级级别id,分类id
        this.addform.parentID = this.number[1]
        // level自身的级别id
        this.addform.level = this.number.length + 1
      } else {
        this.addform.level = 0
        this.addform.parentID = 0
      }
    },
    beforeleave(activeName, oldActiveName) {
      if (activeName !== '0' && this.number.length < 2) {
        this.$msg.error('请选择商品分类')
        return false
      } else {
        return true
      }
    },
    // 图片上传逻辑
    handleRemove(file, fileList) {
      // console.log(file)
      // 遍历查询出id
      const fileindex = this.addform.pictruePath.findIndex(
        (x) => x === file.response.data.path
      )
      this.addform.pictruePath.splice(fileindex, 1)
      // 删除后再查看
      // console.log(this.addform)
    },
    handlePreview(file) {
      console.log(file)
      this.previewVisible = true
      this.previewUrl = file.response.data.url
    },
    handlesuccess(response, file, fileList) {
      // console.log(response)
      this.addform.pictruePath.push(response.data.path)
      console.log(this.addform)
    },
    // 处理富文本
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
      console.log(this.addform)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.content = html
    },
  },
}
</script>

<style>
.el-tabs {
  margin-top: 15px;
}
.el-card {
  margin-top: 10px;
}
.el-pictrue {
  width: 100%;
}
</style>
