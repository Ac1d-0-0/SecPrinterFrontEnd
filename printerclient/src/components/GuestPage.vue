<template>
  <el-row>
      <div class="grid-content bg-purple-dark"></div>
  </el-row>
  <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
  >
    <el-form-item label="printerId" prop="id">
      <el-input
          v-model="ruleForm.id"
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
        callback(new Error('请输入Id'))
      } else {
        if (this.ruleForm.id !== '') {
          this.$refs.ruleForm.validateField('id')
        }
        callback()
      }
    }
    return {
      ruleForm: {
        id: '',
        passwd: '',
      },
      rules: {
        passwd: [{validator: validatePass, trigger: 'blur'}],
        id: [{validator: validateUsername, trigger: 'blur'}]
      },
    }
  },

  methods: {
    submitForm(formName) {
      let result = null
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let auth_data = new FormData();
          auth_data.append('id', this.ruleForm.id);
          auth_data.append('passwd', this.ruleForm.passwd);
          await axios.post(this.store.state.serverAddr + "print_doc_by_pass", auth_data)
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
            this.store.state.guest_active += 1
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
  name: "GuestPage",
}
</script>

<style scoped>

</style>