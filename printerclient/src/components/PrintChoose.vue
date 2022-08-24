<template>
  <template v-if="store.state.ifLogin">
    <el-table
        ref="multipleTable"
        :data="this.store.state.printerList"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column prop="name" label="打印机名" ></el-table-column>
      <el-table-column label="ID">
        <template #default="scope">{{ scope.row.ID }}</template>
      </el-table-column>
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button @click="handleSelect(scope.$index, scope.row);scope.row.showSelect=true" type="primary"
                     v-if="!scope.row.showSelect">
            选择
          </el-button>
          <el-button @click="handleSelect(scope.$index, scope.row);scope.row.showSelect=false" type="danger"
                     v-if="scope.row.showSelect">
            取消
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div style="margin-top: 20px">
      <el-button @click="saveSelection(this.store.state.printerList)">确认打印</el-button>
<!--      <el-button @click="cancelPrint">取消打印</el-button>-->
      <el-button @click="reload()">刷新列表</el-button>
    </div>
  </template>

  <template v-if="store.state.mode===0">
    <el-row>
      <div class="grid-content bg-purple-dark"></div>
    </el-row>
    <el-form
        :model="guestPrintForm"
        status-icon
        :rules="guestRules"
        ref="guestPrintForm"
        label-width="100px"
    >
      <el-form-item label="打印机ID" prop="id">
        <el-input
            v-model="guestPrintForm.id"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input
            type="password"
            v-model="guestPrintForm.passwd"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('guestPrintForm')">开始打印</el-button>
<!--        <el-button type="danger" @click="cancelPrint">取消打印</el-button>-->
        <el-button @click="resetForm('guestPrintForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </template>

  <template v-if="!store.state.ifLogin && store.state.mode===1">
    <el-col :span="8" :offset="8" @click="goBack">
      <el-result icon="error" title="尚未登录" subTitle="请点击以返回登录">
      </el-result>
    </el-col>
  </template>

</template>

<script>
import axios from 'axios'
import {useStore} from "vuex";
import {ElMessage} from "element-plus";

export default {
  setup: function () {
    const store = new useStore();
    return {
      store
    }
  },



  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.guestPrintForm.passwd !== '') {
          this.$refs.guestPrintForm.validateField('passwd')
        }
        callback()
      }
    }
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Id'))
      } else {
        if (this.guestPrintForm.id !== '') {
          this.$refs.guestPrintForm.validateField('id')
        }
        callback()
      }
    }

    return {
      multipleSelection: [],
      guestPrintForm: {
        id: '',
        passwd: '',
      },
      guestRules: {
        passwd: [{validator: validatePass, trigger: 'blur'}],
        id: [{validator: validateUsername, trigger: 'blur'}]
      },
    }
  },

  methods: {


    async saveSelection(printerList) {
      let chosenPrinters = []
      printerList.forEach((printer) => {
        if (printer.showSelect) {
          chosenPrinters.push(printer.ID)
        }
      })

      if(chosenPrinters.length===0){
        ElMessage("请至少选择一个打印机")
      }else if(chosenPrinters.length>1){
        ElMessage("最多选择一个打印机")
      }else{
        let printerData = new FormData();
        let result = null
        printerData.append('printers',JSON.stringify(chosenPrinters));
        await axios.post(this.store.state.serverAddr+"send_print_request",printerData)
            .then(response => {
              result = response.data.status
            })
            .catch(function (error) {
              result = error.status
            })

        if (result === 200){
          this.store.state.printResult="打印成功，即将返回主页面"
          this.store.state.active=4
          this.store.state.waitPrint=false
        } else {
          ElMessage.error("打印失败，内部错误，请重启重试")
          this.store.state.active=2
        }
      }
    },

    handleSelect(index, row) {
      console.log(index, row)
      row.type = "danger"
    },


    // 刷新打印机列表
    async reload() {
      let auth_data = new FormData();
      auth_data.append('username', this.store.state.username);
      auth_data.append('passwd', this.store.state.passwd);
      let printer_map;
      // let result;
      await axios.post(this.store.state.serverAddr + "get_printers", auth_data)
          .then(response => {
            printer_map = response.data.printerMap
          })
          .catch(function (error) {
            console.log(error)
          })

      // 接入渲染
      this.store.state.printerList = []
      for (var key in printer_map) {
        this.store.state.printerList.push({"ID": key, "name": printer_map[key]})
      }

    },

    goBack(){
      this.store.state.active=1
    },

    cancelPrint(){
      let result = null
      axios.get(this.store.state.serverAddr+"cancel_print")
          .then(response => {
            result = response.data.status
          })
          .catch(function (error) {
            result = error.status
          })
      if (result === 200) {
        ElMessage.info("取消成功，正在返回主页面")
        this.store.state.active=2
        this.store.state.waitPrint=false
      }

      // 内部错误
      else if (result === 500) {
        ElMessage.error("内部错误，正在返回主页面")
        this.store.state.active=2
        this.store.state.waitPrint=false
      }
    },



    submitForm(formName) {
      let result = null
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let auth_data = new FormData();
          auth_data.append('id', this.guestPrintForm.id);
          auth_data.append('passwd', this.guestPrintForm.passwd);
          await axios.post(this.store.state.serverAddr + "print_doc_by_pass", auth_data)
              .then(response => {
                result = response.data.status
              })
              .catch(function (error) {
                result = error.status
              })

          // 认证成功
          if (result === 200) {
            this.store.state.printResult="打印成功，即将返回主页面"
            this.store.state.active=4
            this.store.state.waitPrint=false
          }

          // 认证失败
          else if (result === 400) {
            this.store.state.waitPrint=true
            ElMessage.error("打印机ID错误或密码错误,请重新输入")
          }

          // 内部错误
          else if (result === 500) {

            ElMessage.error("内部错误，请重启应用或联系管理员")
            this.store.state.active=2

          }


        } else {
          ElMessage.error("内部错误，请重启应用或联系管理员")
          this.store.state.active=2

        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

  }
  ,
}
</script>