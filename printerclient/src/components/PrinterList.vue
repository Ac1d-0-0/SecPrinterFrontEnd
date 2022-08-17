<template>
  <template v-if="store.state.ifLogin">
    <el-table
        ref="multipleTable"
        :data="this.store.state.printerList"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column prop="name" label="打印机名" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
      <el-table-column label="ID" width="120">
        <template #default="scope">{{ scope.row.ID }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
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
      <el-button @click="reload()">刷新列表</el-button>
    </div>
  </template>
  <template v-if="!store.state.ifLogin">
    <el-col :span="8" :offset="8">
      <el-result icon="error" title="尚未登录" subTitle="请点击用户详情进行登录">
      </el-result>
    </el-col>
  </template>

</template>

<script>
import axios from 'axios'
import {useStore} from "vuex";

export default {
  setup: function () {
    const store = new useStore();
    return {
      store
    }
  },
  data() {
    return {
      multipleSelection: [],
    }
  },

  methods: {
    async saveSelection(printersChosen) {

      // 清除历史设置
      axios.post(this.store.state.serverAddr + "clear_printers")
          .then(response => (console.log(response.data)))
          .catch(function (error) {
            console.log(error)
          })

      // 设置打印机
      printersChosen.forEach((printer) => {
        if (printer.showSelect) {
          let printer_data = new FormData();
          printer_data.append('printerId', printer.ID);
          axios.post(this.store.state.serverAddr + "set_printers", printer_data)
              .then(response => (console.log(response.data)))
              .catch(function (error) {
                console.log(error)
              })
        }
      })

      //TODO send print_request
      let result = null;
      await axios.post(this.store.state.serverAddr + "send_print_request")
          .then(response => {
            console.log(response.data)
            result = response.data.status
          })
          .catch(function (error) {
            console.log(error)
            result = error.status
          })

      console.log("result:" + result)
      if (result === 200){
        this.store.state.active = 2
      } else {
        await this.$alert('打印失败', '内部错误，请重启重试', {
          confirmButtonText: '确定',
          callback: () => {
          },
        })
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
            printer_map = response.data.printer_map
          })
          .catch(function (error) {
            console.log(error)
          })

      // 接入渲染
      this.store.state.printerList = []
      for (var key in printer_map) {
        this.store.state.printerList.push({"ID": key, "name": printer_map[key], "address": "敬请期待"})
      }
      console.log("刷新完成")
    }

  }
  ,
}
</script>