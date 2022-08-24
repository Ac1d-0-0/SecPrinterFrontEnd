<template>
  <el-container>
    <el-header>
      <el-steps :active="store.state.active" simple>
        <el-step title="用户登录"  id="login"></el-step>
        <el-step title="打印任务" id="choose"></el-step>
        <el-step title="打印机选择" id="confirm"></el-step>
        <el-step title="打印结果" id="result"></el-step>
      </el-steps>
    </el-header>
    <el-main>
      <el-row v-if="store.state.active === 1">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <LoginPage/>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="store.state.active === 2">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <WaitPage/>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="store.state.active === 3">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <PrintChoose/>
          </div>
        </el-col>
      </el-row>

      <el-row v-if="store.state.active === 4">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <PrintResult/>
          </div>
        </el-col>
      </el-row>

    </el-main>

  </el-container>



</template>

<script>
import PrintChoose from '@/components/PrintChoose'
import {useStore} from 'vuex'
import axios from "axios"
import WaitPage from "@/components/WaitPage";
import LoginPage from "@/components/LoginPage";
import PrintResult from "@/components/PrintResult";
import {ElMessage} from "element-plus";



export default {
  name: 'App',
  components: {
    LoginPage,
    WaitPage,
    PrintResult,
    PrintChoose,

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

  created() {
    const ipcRenderer = window.require("electron").ipcRenderer
    ipcRenderer.on("printRequest", async () => {
      if (this.store.state.ifLogin || this.store.state.mode === 0) {
        if(this.store.state.mode===1){
          let auth_data = new FormData();
          auth_data.append('username', this.store.state.username);
          auth_data.append('passwd', this.store.state.passwd);
          let printer_map;
          await axios.post(this.store.state.serverAddr + "get_printers", auth_data)
              .then(response => {
                printer_map = response.data.printerMap
              })
              .catch(function (error) {
                console.log(error)
              })

          // 接入渲染
          this.store.state.printerList = []
          console.log(this.store.state.printerList)
          for (var key in printer_map) {
            this.store.state.printerList.push({"ID": key, "name": printer_map[key]})
          }
        }
        this.store.state.active = 3
      } else {
        ElMessage.error("请先完成登录或进入游客模式再打印")
        this.store.state.waitPrint = true
      }

    });
  }
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
