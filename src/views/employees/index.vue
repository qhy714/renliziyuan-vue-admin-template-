<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1条记录">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button type="primary" size="mini" @click="dialogVisible = true"
            >新增员工</el-button
          >
        </template>
      </PageTool>

      <el-card style="margin-top: 15px">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 40px"
                @click="showQrDialog(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <!-- 1. -->
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column> -->
          <!--2. 作用域插槽 -->
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column> -->
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px" align="center">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="$router.push('/employee/detail/' + scope.row.id)"
                >查看</el-button
              >
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRoleDialog(scope.row.id)"
                >角色</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分配角色 -->
      <el-dialog title="分配角色" :visible.sync="roleVisible">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in roleList"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
        <template #footer>
          <el-button type="primary" @click="assignRoles">确定</el-button>
          <el-button @click="roleVisible = false">取消</el-button>
        </template>
      </el-dialog>
      <!-- 新增对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        @click="handleClose"
      >
        <el-form
          ref="employeeRef"
          label-width="30%"
          :model="addEmployees"
          :rules="rules"
        >
          <el-form-item label="姓名" prop="username">
            <el-input
              v-model="addEmployees.username"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="addEmployees.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="addEmployees.timeOfEntry"
              type="date"
              placeholder="请选择入职时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="聘用形式" prop="formOfEmployment">
            <el-select
              v-model="addEmployees.formOfEmployment"
              placeholder="请选择聘用形式"
            >
              <el-option
                v-for="item in hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
            <el-input
              v-model="addEmployees.workNumber"
              placeholder="请输入工号"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="departmentName">
            <el-input
              v-model="addEmployees.departmentName"
              placeholder="请选择部门"
              @focus="showDepartment"
            ></el-input>
            <el-tree
              v-if="departmentList.length > 0"
              :data="departmentList"
              default-expand-all
              :props="{ label: 'name' }"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-form-item>
          <el-form-item label="转正时间" prop="correctionTime">
            <el-date-picker
              v-model="addEmployees.correctionTime"
              type="date"
              placeholder="请选择转正时间"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 二维码对话框 -->
    <el-dialog title="图片二维码" :visible.sync="qrcodeVisible">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { getDepartmentsList } from '@/api/department'
import { validMobile } from '@/utils/validate'
import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
import { getEmployee, AddEmployees, assignRoles } from '@/api/employee'
import employees from '@/constant/employees'
export default {
  name: 'Employee',
  filters: {
    formatFormType (id) {
      return employees.hireType.find(item => item.id === id - 0).value
    }
  },
  components: {},
  data () {
    const validateMobile = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机号格式不对'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 9999
      },
      employees: [],
      total: null,
      dialogVisible: false,
      // 分配角色
      roleVisible: false,
      checkList: [],
      roleList: [],
      id: null,

      addEmployees: {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        workNumber: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]

      },
      hireType: employees.hireType,
      departmentList: [],
      qrcodeVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    formatterEmployee (row, column, cellValue, index) {
      var obj = employees.hireType.find(item => item.id === cellValue)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue).value
      } else {
        return '未知'
      }
    },
    async exportExcel () {
      // 1.获取所有数据列表
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      // 2.把列表数据进行加工处理变成二维数组
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      // 把英文的表头映射成中文的
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))

      // 只有点击了按钮才会导入
      import('@/vendor/Export2Excel').then(excel => {
        // 3.使用这个插件导出成excel
        // const tHeader = ['编号', '姓名']
        // const data = [[1, '张三'], [2, '李四']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },

    exportExcel1 () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },

    async add () {
      const res = await AddEmployees(this.addEmployees)
      console.log(res)
      this.getEmployee()
      this.dialogVisible = false
    },
    async showRoleDialog (id) {
      this.id = id
      const { rows } = await getRoleList({ page: 1, size: 9999 })
      this.roleList = rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
      this.roleVisible = true
    },
    async assignRoles () {
      const res = await assignRoles({
        id: this.id,
        roleIds: this.checkList
      })
      console.log(res)
      this.roleVisible = false
    },
    handleClose () {
      this.$refs.employeeRef.resetFields()
      this.departmentList = []
    },
    async showDepartment () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.departmentList = tranferListToTree(res.depts, '')
    },
    handleNodeClick (obj) {
      this.addEmployees.departmentName = obj.name
      this.departmentList = []
    },
    showQrDialog (src) {
      this.qrcodeVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }

  }
}
</script>

<style scoped lang='scss'>
.el-input {
  width: 70%;
}
</style>
