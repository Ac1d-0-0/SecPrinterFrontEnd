<template>
  <el-row v-if="store.state.ifLogin">
    <el-col :span="24">当前账户: {{ ruleForm.username }}
      <div class="grid-content bg-purple-dark"></div>
    </el-col>
  </el-row>
  <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
  >
    <el-form-item label="用户名" prop="username">
      <el-input
          v-model="ruleForm.username"
          autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="passwd">
      <el-input
          type="password"
          v-model="ruleForm.passwd"
          autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {useStore} from 'vuex'
import axios from 'axios'

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
        if (this.ruleForm.passwd !== '') {
          this.$refs.ruleForm.validateField('passwd')
        }
        callback()
      }
    }
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        if (this.ruleForm.username !== '') {
          this.$refs.ruleForm.validateField('username')
        }
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        passwd: '',
      },
      rules: {
        passwd: [{validator: validatePass, trigger: 'blur'}],
        username: [{validator: validateUsername, trigger: 'blur'}]
      },
    }
  },

  methods: {
    submitForm(formName) {
      let result = null
      let printer_map = null
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //TODO send /auth to server
          let auth_data = new FormData();
          auth_data.append('username', this.ruleForm.username);
          auth_data.append('passwd', this.ruleForm.passwd);
          await axios.post(this.store.state.serverAddr + "auth", auth_data)
              .then(response => {
                result = response.data.result
                console.log(result)
              })
              .catch(function (error) {
                console.log(error)
                result = error.status
              })

          console.log("result:" + result)
          // 认证成功
          if (result === 200) {
            this.store.state.username = this.ruleForm.username
            this.store.state.passwd = this.ruleForm.passwd
            this.store.state.ifLogin = true

            // 获取打印机列表
            await axios.post(this.store.state.serverAddr + "get_printers", auth_data)
                .then(response => {
                  printer_map = response.data.printer_map
                  result = response.data.result
                })
                .catch(function (error) {
                  console.log(error)
                })

            // 接入渲染
            this.store.state.printerList = []
            for (var key in printer_map){
              this.store.state.printerList.push({"ID": key, "name": printer_map[key], "address": "敬请期待"})
            }
            console.log("printerlist")
            console.log(this.store.state.printerList)

            await this.$alert('登录认证成功', '消息', {
              confirmButtonText: '确定',
              callback: () => {
              },
            })
          }

          // 认证失败
          if (result === 400) {
            await this.$alert('登录认证失败', '密码和用户名不一致', {
              confirmButtonText: '确定',
              callback: () => {
              },
            })
          }

          // 内部错误
          if (result === 500) {
            await this.$alert('内部错误', '请联系管理员', {
              confirmButtonText: '确定',
              callback: () => {
              },
            })
          }

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  name: "LoginPage",
}
</script>