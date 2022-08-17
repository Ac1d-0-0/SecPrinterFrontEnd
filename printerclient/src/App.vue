<template>
  <el-switch v-model="ifAnom" active-text="用户模式" inactive-text="游客模式" @change="modeChange()">
  </el-switch>
  <el-container v-if="store.state.mode === 1">
    <el-header>
      <el-steps :active="store.state.active" simple>
        <el-step title="步骤 1：登录" v-if="!store.state.ifLogin" id="login"></el-step>
        <el-step title="步骤 1：注销" v-if="store.state.ifLogin" id="logout"></el-step>
        <el-step title="步骤 2：选择打印机" id="choose"></el-step>
        <el-step title="步骤 3：打印结果" id="confirm"></el-step>
      </el-steps>
    </el-header>
    <el-main>
      <el-row v-if="store.state.active === 0">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <UserInfo/>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="store.state.active === 1">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <PrinterList/>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="store.state.active === 2">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <ConfirmPrint/>
          </div>
        </el-col>
      </el-row>

    </el-main>

    <el-footer>
      <el-row justify="center">
        <el-col class="grid-content" v-if="!(store.state.active === 0)" :span="3">
            <el-button type="primary" @click="store.state.active--" plain>上一步</el-button>
        </el-col>
        <el-col class="grid-content" v-if="!(store.state.active === 2) && store.state.ifLogin" :span="3">
            <el-button type="primary" @click="store.state.active++" plain>下一步</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>

  <el-container v-if="store.state.mode === 0">
    <el-header>
      <el-steps :active="store.state.guest_active" simple>
        <el-step title="步骤 1：通过打印机ID和密码打印" id="guest_choose"></el-step>
        <el-step title="步骤 2：确认打印" id="guest_confirm"></el-step>
      </el-steps>
    </el-header>
    <el-main>
      <el-row v-if="store.state.guest_active === 0">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
              <!-- TODO   游客模式通过id 密码打印          -->
              <GuestPage/>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="store.state.guest_active === 1">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
              <!-- TODO   游客模式通过id 密码打印     确认页面     -->
            <ConfirmPrint/>
          </div>
        </el-col>
      </el-row>
    </el-main>

    <el-footer>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col v-if="!(store.state.active === 1)" :span="8">
          <div class="grid-content bg-purple-dark">
            <el-button type="primary" @click="store.state.guest_active++" plain>下一步</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
      <el-col>

      </el-col>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col v-if="!(store.state.active === 0)" :span="8">
          <div class="grid-content bg-purple-dark">
            <el-button type="primary" @click="store.state.guest_active--" plain>上一步</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
  <div v-if="false">{{ store.state.active }}</div>
</template>

<script>
import PrinterList from '@/components/PrinterList'
//import AddPrinter from '@/components/AddPrinter'
import UserInfo from '@/components/UserInfo'
//import PrinterMessage from '@/components/PrinterMessage'
import ConfirmPrint from '@/components/ConfirmPrint'
import {useStore} from 'vuex'
import axios from "axios"
import GuestPage from "@/components/GuestPage";

export default {
  name: 'App',
  components: {
    GuestPage,
    PrinterList,
    UserInfo,
    ConfirmPrint,
  },

  data() {
    return {ifAnom: true,}
  },

  methods: {
    modeChange(){
        if (this.ifAnom){
          this.store.state.mode = 1
        } else {
          this.store.state.mode = 0
        }
    },

    stepChange() {
      let step1_1 = document.querySelector('#login')
      let step1_2 = document.querySelector('#logout')
      let step2 = document.querySelector('#choose')
      let step3 = document.querySelector('#confirm')
      console.log(step2.getAttribute("status"))
      if (this.store.state.active === 0) {
        if (this.store.state.ifLogin) {
          step1_1.setAttribute('status', 'process')
        } else {
          step1_2.setAttribute('status', 'process')
        }
        step2.setAttribute('status', 'wait')
        step3.setAttribute('status', 'wait')
      }
      if (this.store.state.active === 1) {
        if (this.store.state.ifLogin) {
          step1_2.setAttribute('status', 'finish')
        } else {
          step1_1.setAttribute('status', 'error')
        }
        step2.setAttribute('status', 'process')
        step3.setAttribute('status', 'wait')
      }
      if (this.store.state.active === 2) {
        if (this.store.state.ifLogin) {
          step1_2.setAttribute('status', 'finish')
        } else {
          step1_1.setAttribute('status', 'error')
        }

        // TODO 保存打印选择列表，判断第一步第二步是否完成
        step2.setAttribute('status', 'finish')
        step3.setAttribute('status', 'process')
      }

    },
  },

  async mounted() {
    if (this.store.state.mountTime === 0) {
      console.log(`the component is now mounted.`)
      let username_ = null
      let passwd_ = null
      let ifLogin_ = false
      let code
      await axios.post(this.store.state.serverAddr + "if_login")
          .then(response => {
            code = response.data.status
            if (code === 300) {
              username_ = null
              passwd_ = null
            }
            if (code === 200) {
              username_ = response.data.username
              passwd_ = response.data.passwd
              ifLogin_ = true
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      console.log(username_)
      console.log(passwd_)
      console.log(ifLogin_)
      this.store.state.username = username_
      this.store.state.passwd = passwd_
      this.store.state.ifLogin = ifLogin_
      this.store.state.mountTime = 1
    }
  },

  setup() {
    const store = new useStore();
    return {
      store
    }
  },
}

</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  background-color: #f4f5f7;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}
</style>
