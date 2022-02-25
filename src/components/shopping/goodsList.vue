<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索内容部分 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            class="input-element"
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
        <el-col :span="10" class="button-element">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="CreateGoods()"
            plain
            >增加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品展示部分 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="info" label="商品描述"> </el-table-column>
        <el-table-column
          prop="pirce"
          label="商品价格(元)"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="repertory"
          label="商品库存"
          width="180"
        ></el-table-column>
        <el-table-column prop="handle" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editGoods(scope.row)"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="DeleteGoods(scope.row)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="queryInfo.pnumsize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totapage"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品数据
      tableData: [],
      // 页数处理
      queryInfo: {
        query: '',
        pnum: 1,
        pnumsize: 10,
      },
      // 数据总数
      totapage: 0,
    }
  },
  created() {
    this.tableDataFunc()
  },
  methods: {
    async tableDataFunc() {
      // 打开页面获取数据
      const { data: res } = await this.$http.get('/goods/findgoodsPaging/', {
        params: this.queryInfo,
      })
      //   console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.tableData = res.data.goodslist
      //   console.log(this.tableData)
      this.totapage = res.data.totapage
    },
    handleSizeChange(val) {
      // 每页/几条
      this.queryInfo.pnumsize = val
      //   console.log(val)
      this.tableDataFunc()
    },
    handleCurrentChange(val) {
      // 当前第几页
      this.queryInfo.pnum = val
      //   console.log(val)
      this.tableDataFunc()
    },
    sendfind() {
      // 发送搜索,始终从第一页开始搜索
      this.queryInfo.pnum = 1
      this.tableDataFunc()
    },
    CreateGoods() {
      // 创建商品,点击跳转新的页面
      this.$router.push('/create_goods')
    },
    editGoods() {
      // 编辑商品
    },
    DeleteGoods() {
      // 删除商品
    },
  },
}
</script>

<style>
.input-element {
  margin-left: 4%;
}
.button-element {
  margin-left: 25px;
}
</style>
