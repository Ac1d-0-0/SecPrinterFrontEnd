<template>
  <el-row>
    <el-col :span="24">
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="22">
    </el-col>
    <el-col :span="2">
      <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :icon="UserFilled" />
      </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-text="store.state.userInfo" ></el-dropdown-item>
            <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>


    </el-col>
  </el-row>
  <el-row>
    <el-col class="center">
      <el-empty :image-size="100" description="暂无打印任务" />
    </el-col>
  </el-row>

</template>


<script>
import { UserFilled } from '@element-plus/icons-vue'
import {useStore} from "vuex";
import axios from "axios";

export default {
  name: "WaitPage",
  components: {

  },
  setup:function(){
    const store = new useStore();
    return {
      store,
      UserFilled
    }
  },
  methods: {
    async logout(){
      let code
      this.store.state.ifLogin = false
      this.store.state.mode=1
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
      this.store.state.active=1
    },
  }

}


</script>

<style scoped>

</style>