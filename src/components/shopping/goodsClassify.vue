<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部内容 -->
    <el-card>
      <el-row :gutter="10">
        <!-- 搜索内容 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @blur="sendfind"
            @keyup.enter.native="sendfind"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="sendfind"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 增加商品类内容 -->
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="el-addUser"
            @click="clickCreateGoods()"
            plain
            >增加商品类</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <tree-Table
          class="treetable"
          :data="goodsify"
          :columns="columnlist"
          children-prop="child_node"
          :selection-type="false"
          :expand-type="false"
        >
          <template slot="level" slot-scope="scope">
            <el-tag v-if="scope.row.level === 1" type="success"
              >一级分类</el-tag
            >
            <el-tag v-if="scope.row.level === 2" type="danger">二级分类</el-tag>
            <el-tag v-if="scope.row.level === 3">三级分类</el-tag>
          </template>
          <template slot="options" slot-scope="">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-Table>
      </el-row>
    </el-card>
    <!-- 添加商品类弹窗 -->
    <el-dialog
      title="增加商品"
      :visible.sync="dialogTableVisible"
      :before-close="closedialogFormVisible"
    >
      <el-form :model="form" ref="formRef" :rules="formRef">
        <el-form-item
          label="商品名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-col :span="15"
            ><el-input v-model="form.name" autocomplete="off"></el-input
          ></el-col>
        </el-form-item>
        <el-form-item label="所属种类" :label-width="formLabelWidth">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedialogFormVisible">取 消</el-button>
        <el-button type="primary" @click="senddialogFormVisible"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
      },
      goodsify: [],
      columnlist: [
        { label: '分类名称', prop: 'name' },
        { label: '分类等级', type: 'template', template: 'level' },
        { label: '操作', type: 'template', template: 'options' },
      ],

      // 增加商品数据内容
      formLabelWidth: '90px',
      dialogTableVisible: false,
      form: {
        name: '',
        level: 1,
        parentlevel: 0,
      },
      options: [],
      number: [],
      formRef: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getgoodsifylist()
  },

  methods: {
    // 获取列表数据
    async getgoodsifylist() {
      const { data: res } = await this.$http.get(
        '/goods/findgoodsify/?find=all&level=3'
      )
      // console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.goodsify = res.data
      // console.log(this.goodsify)
    },
    // 发送搜索
    sendfind() {},

    // 点击弹出弹窗
    async clickCreateGoods() {
      this.dialogTableVisible = true
      const { data: res } = await this.$http.get(
        '/goods/findgoodsify/?find=all&level=2'
      )
      // console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.options = res.data
      // console.log(this.options)
    },

    // 点击关闭弹窗
    closedialogFormVisible() {
      this.$refs.formRef.resetFields()
      this.dialogTableVisible = false
      this.value = []
    },

    // 点击确认发送请求
    senddialogFormVisible() {
      this.$refs.formRef.validate(async (value) => {
        if (!value) return
        const { data: res } = await this.$http.post(
          '/goods/addgoodsify/',
          this.$qs.stringify(this.form)
        )
        console.log(res)
        if (res.status !== 10000) {
          this.closedialogFormVisible()
          this.getgoodsifylist()
          return this.$msg.error(res.message)
        } else {
          this.closedialogFormVisible()
          this.getgoodsifylist()
          return this.$msg.success(res.message)
        }
      })
    },

    // 获取选中添加时的值
    handleChange(value) {
      console.log(this.number)
      if (this.number.length > 0) {
        // parentlevel父级级别id,分类id
        this.form.parentlevel = this.number[this.number.length - 1]
        // level自身的级别id
        this.form.level = this.number.length + 1
      } else {
        this.form.level = 1
        this.form.parentlevel = 0
      }
    },
  },
}
</script>

<style>
.treetable {
  top: 15px;
}
</style>
