<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool>
        <template #right>
          <el-button type="primary" size="mini">添加权限</el-button>
        </template>
      </PageTool>
      <el-card>
        <el-table-column label="名称"></el-table-column>
        <el-table-column label="标识"></el-table-column>
        <el-table-column label="描述"></el-table-column>
        <el-table-column label="操作">
          <el-button type="text">添加</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </el-table-column>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
