<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-table :data="menulist" style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="权限路径"></el-table-column>
            <el-table-column prop="Level" label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.Level == 1">一级目录</el-tag>
                    <el-tag type="warning" v-else>二级目录</el-tag>
                </template>
            </el-table-column>
           <el-table-column prop="parentLevel" label="父级编号"></el-table-column>
            <el-table-column label="父级名称">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.parentLevel != 1">{{ menulist[scope.row.parentLevel - 2].name }}</el-tag>
                    <!-- <el-tag type="warning" v-else>二级目录</el-tag> -->
                </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get('/menu/menulist/', {
        params: { type: 'list' },
      })
      // console.log(res)
      if (res.status !== 1000) return this.$msg.error(res.message)
      this.menulist = res.data
    },
  },
}
</script>
