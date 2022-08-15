<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
        <el-descriptions title="详情" direction="vertical" :column="4" border>
          <el-descriptions-item label="用户名">{{store.state.username}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
        <el-button @click="confirm()">确认登出</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {useStore} from 'vuex'
import axios from "axios"

export default {
  name: "ConfirmLogout",
  setup:function(){
    const store = new useStore();
    return {
      store
    }
  },
  methods: {
    async confirm(){
      let code
      this.store.state.ifLogin = false
      this.store.state.printerList = []
      await axios.post(this.store.state.serverAddr + "logout")
          .then(response => {
            code = response.data.status
            if (code === 400) {
              console.log(400)
            }
            if (code === 200) {
              this.store.state.ifLogin = false
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
  }
}
</script>

<style scoped>

</style>