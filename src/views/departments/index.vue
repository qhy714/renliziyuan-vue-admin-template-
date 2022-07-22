<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isLoading" style="min-height: 700px">
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @delDepartment="getDepartmentsList"
            ></TreeItem>
            <!-- :default-expand-all='true' -->
            <el-tree :data="data" default-expand-all>
              <!-- 使用scope slot 会传入两个参数node和data，分别表示当前节点的Node对象和当前节点的数据  element内树形控件带有node和data-->
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getDepartmentsList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentsList } from '@/api/department'
import TreeItem from './components/TreeItem.vue'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1'
        }]
      }],
      titleObj: {},
      isLoading: true

    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
  },
  methods: {
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      console.log(res)

      // 递归  获取各层级部门数据
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          // 判断list里pid  和item每一项里的pid（即子项中的pid）是否相同  相同就添加到新数组list1内
          if (item.pid === pid) {
            list1.push(item)
            // 重新调用函数赋值给每一项的子项
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      const res1 = tranferListToTree(res.depts, '')
      console.log(res1)

      this.data = res1 // 把数据存放到data新建的数组中

      this.titleObj = res.depts[0] // 把标题传进去
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
