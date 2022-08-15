<template>
  <el-row>
    <el-col :span="24">
    </el-col>
  </el-row>
  <el-row v-if="!store.state.ifLogin">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
        <login-page/>
      </div>
    </el-col>
  </el-row>

  <el-row v-if="store.state.ifLogin">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
          <confirm-logout/>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {useStore} from 'vuex'
import LoginPage from '@/components/LoginPage'
import ConfirmLogout from '@/components/ConfirmLogout'
export default {
  name: "UserInfo",
  components: {
    LoginPage,
    ConfirmLogout
  },
  setup:function(){
    const store = new useStore();
    return {
      store
    }
  },
}
</script>

<style scoped>

</style>