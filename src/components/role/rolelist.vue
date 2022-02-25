<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-table :data="rolelist" style="width: 60%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-row v-for="i in props.row.menus" :key="i.id">
                  <el-col :span="6" :offset="3"
                    ><el-tag>{{ i.name }}</el-tag></el-col
                  >
                  <el-col :span="6">
                    <el-tag
                      class="grid-content bg-purple"
                      v-for="s in i.subLevel"
                      :key="s.id"
                    >{{ s.name }}</el-tag>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column prop="desc" label="角色详情"></el-table-column>
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('/menu/rolelist/')
      console.log(res)
      if (res.status !== 10000) return this.$msg.error(res.message)
      this.rolelist = res.data
    },
  },
}
</script>
