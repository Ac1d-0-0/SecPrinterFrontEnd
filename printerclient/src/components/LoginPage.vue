<template>

  <el-form
      :model="LoginForm"
      status-icon
      :rules="regRules"
      ref="LoginRef"
      label-width="100px"
  >
    <el-form-item label="用户名" prop="UserName">
      <el-input
          v-model="LoginForm.UserName"
          autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="Password">
      <el-input
          type="password"
          v-model="LoginForm.Password"
          autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="Login()">登录</el-button>
      <el-button type="primary" @click="RegisterVisible=true">注册</el-button>
      <el-button type="primary" @click="ForgetVisible=true">忘记密码</el-button>
      <el-button type="primary" @click="guestLogin()">游客进入</el-button>
    </el-form-item>
  </el-form>

  <el-dialog v-model="RegisterVisible" title="用户注册" width="70%">
    <el-form :model="RegisterForm" :rules="regRules" ref="RegisterRef" label-width="140px">
      <el-form-item label="用户名" prop="UserName">
        <el-input v-model="RegisterForm.UserName" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="Password">
        <el-input v-model="RegisterForm.Password" ></el-input>
      </el-form-item>
      <el-row justify="end">
        <el-form-item>
          <el-button type="primary" @click="Register();RegisterVisible = false">确认注册</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>


  <el-dialog v-model="ForgetVisible" title="" width="50%">
   <el-row>
    <el-col class="center">
      <el-result icon="info" title="忘记密码">
        <template #sub-title>
          <p>请联系管理员重置</p>
        </template>
        <template #extra>
          <el-button type="primary" @click="ForgetVisible=false">确定</el-button>
        </template>
      </el-result>
    </el-col>
    </el-row>
  </el-dialog>


</template>

<script>
import {useStore} from 'vuex'
import axios from 'axios'
import {reactive, ref, unref} from "vue";
import {ElMessage} from "element-plus";

export default {
  setup: function () {
    const store = new useStore();
    const LoginRef = ref();
    const RegisterRef = ref();
    const RegisterVisible = ref(false)
    const ForgetVisible = ref(false)
    const RegisterForm = reactive({
      UserName: '',
      Password: '',
    })
    const LoginForm= reactive( {
      UserName: '',
      Password: '',
    })
    const regRules = reactive({
      UserName: [
        {required: true, message: "请输入用户名", trigger: "blur"}
      ],
      Password: [
        {required: true, message: "请输入密码", trigger: "blur"}
      ]
    })


    return {
      store,
      RegisterRef,
      RegisterVisible,
      RegisterForm,
      regRules,
      ForgetVisible,
      LoginRef,
      LoginForm,
    }
  },

  methods: {
    async Login() {
      let result = null
      let printer_map = null
      const form = unref(this.LoginRef)
      if (!form) {
        return
      }
      try {
        const valid = form.validate()
        if (valid) {
          let auth_data = new FormData();
          auth_data.append('username', this.LoginForm.UserName);
          auth_data.append('passwd', this.LoginForm.Password);
          await axios.post(this.store.state.serverAddr + "auth", auth_data)
              .then(response => {
                result = response.data.result
              })
              .catch(function (error) {
                result = error.status
              })
          // 认证成功
          if (result === 200) {
            this.store.state.username = this.LoginForm.UserName
            this.store.state.passwd = this.LoginForm.Password
            this.store.state.ifLogin = true
            ElMessage({
              message: '登录成功',
              type: 'success',
            })
            // 获取打印机列表
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
            if (this.store.state.waitPrint) {
              this.store.state.active = 3
              this.store.state.waitPrint = false
            } else {
              this.store.state.active = 2
            }
            this.store.state.userInfo = "你好：" + this.LoginForm.UserName
          }

          // 认证失败
          else if (result === 400) {
            ElMessage.error("登录认证失败,用户名或密码不正确")
          }

          // 内部错误
          else if (result === 500) {
            ElMessage.error("内部错误，请重启应用或联系管理员")
          } else {
            ElMessage.error("内部错误，请重启应用或联系管理员")

          }

        } else {
          ElMessage.error("内部错误，请重启应用或联系管理员")
        }
      }catch (err) {
        ElMessage.error("登录失败，内部错误，请重启应用或联系管理员")
      }

    },
    Register() {
      const form = unref(this.RegisterRef)
      if (!form) {
        return
      }
      try {
        const valid = form.validate()
        if (valid) {
          let regData = new FormData();
          regData.append('UserName',this.RegisterForm.UserName);
          regData.append('Password', this.RegisterForm.Password);
          axios.post(this.store.state.serverAddr + "register",
              regData
          ).then(res => {
            if (res.status === 200) {
              ElMessage({
                message: '注册成功',
                type: 'success',
              })
            } else {
              ElMessage.error("注册失败")
            }
          }).catch(function (error) {
            ElMessage.error("网络错误")
            console.log(error);
          });
        }
      } catch (err) {
        ElMessage.error(this.store.state.serverAddr + "register")
        ElMessage.error("注册失败")
        console.log(err)
      }
    },


    guestLogin(){
      this.store.state.mode=0
      ElMessage({
        message: '游客登录成功',
        type: 'success',
      })
      if(this.store.state.waitPrint){
        this.store.state.active=3
        this.store.state.waitPrint=false
      }else{
        this.store.state.active=2
      }
      this.store.state.userInfo="你好：游客"
    },


  },
  name: "LoginPage",
}
</script>