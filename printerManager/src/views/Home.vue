<template>
  <el-tabs :tab-position="tabPosition" style="height: 200px">
    <el-tab-pane label="已注册打印机">
      <el-row justify="end" style="margin-bottom: 10px">
        <el-button type="primary" @click="getPrinterAdded" :icon="Refresh" plain>刷新</el-button>
      </el-row>
      <el-row>
        <el-table :data="printerInfo" border stripe style="width: 100%">
          <el-table-column prop="PrinterID" label="ID"/>
          <el-table-column prop="NickName" label="名称"/>
          <el-table-column prop="PrinterName" label="打印机"/>
          <el-table-column prop="GuestPass" label="密码"/>
          <el-table-column prop="AllowPasswd" label="允许密码打印"/>
          <el-table-column prop="AllowAll" label="打印机权限"/>
          <el-table-column label="打印机管理" min-width="145px">
            <template v-slot="tableData">
              <el-tooltip content="打印机权限管理" effect="light">
                <el-button type="info" :icon="Avatar"
                           @click="editPrivilege(tableData.row);dialogVisible = true" circle></el-button>
              </el-tooltip>
              <el-tooltip content="重置打印机密码" effect="light">
                <el-button type="danger" @click="resetPasswd(tableData.row.PrinterID)" :icon="RefreshLeft" circle></el-button>
              </el-tooltip>
              <el-tooltip content="修改打印机信息" effect="light">
                <el-button type="warning" :icon="Setting"
                           @click="editPrinter(tableData.row);EditVisible= true"
                           circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除打印机" effect="light">
                <el-button type="danger" @click="delPrinter(tableData.row.PrinterID)" :icon="Delete" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-dialog v-model="dialogVisible" title="打印机权限修改" width="70%">

        <el-dialog v-model="innerVisible" width="80%" title="打印机授权用户管理" append-to-body>
          <el-dialog v-model="userVisible" width="40%" title="添加授权账号" append-to-body>
            <el-form :model="userForm" ref="addUserRef">
              <el-input v-model="userForm.PrinterID" prop="PrinterID" v-show="false"></el-input>
              <el-form-item label="用户名">
                <el-input v-model="userForm.UserID" prop="UserID" placeholder="请输入需要添加授权的用户名"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="addAuthorizedUser();userVisible = false">确认添加</el-button>
                </span>
            </template>
          </el-dialog>
          <el-row justify="end">
            <el-button type="primary" @click="userVisible=true" auto-insert-space>添加授权用户</el-button>
          </el-row>
          <el-table :data="authorizedUsers" border stripe height="200">
            <el-table-column fixed prop="UserName" label="已授权账号"/>
            <el-table-column label="删除">
              <template v-slot="authUserSlot">
                <el-button type="danger" @click="delAuthorizedUser(authUserSlot.row.UserName)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
          <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click=";innerVisible = false">确认</el-button>
                </span>
          </template>
        </el-dialog>
        <el-form :model="pForm" ref="privilegeRef">
          <el-input v-model="pForm.PrinterID" v-show="false"></el-input>
          <el-form-item label="允许使用密码打印：">
            <el-switch v-model="pForm.AllowPasswd" inline-prompt active-text="Y"
                       inactive-text="N"></el-switch>
          </el-form-item>
          <el-form-item label="打印机授权用户">
            <el-radio-group v-model="pForm.AllowAll">
              <el-radio label="所有用户"></el-radio>
              <el-radio label="部分用户"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <template #footer>
                <span class="dialog-footer">
                   <el-button type="primary" @click="getAuthorizedUser();innerVisible=true">用户授权管理</el-button>
                   <el-button type="primary" @click="handlePrivilegeChange();dialogVisible = false">确认修改</el-button>
                </span>
        </template>
      </el-dialog>

      <el-dialog v-model="EditVisible" title="修改打印机配置" width="70%">
        <el-form :model="editForm" :rules="regRules" ref="editRef" label-width="140px">
          <el-form-item label="打印机ID" prop="PrinterID">
            <el-input v-model="editForm.PrinterID" disabled></el-input>
          </el-form-item>
          <el-form-item label="指定本地打印机" prop="PrinterName">
            <el-select v-model="editForm.PrinterName" placeholder="请选择要添加的本地打印机" @click="getLocalPrinter">
              <el-option v-for="p in localPrinter" :label="p" :value="p" :key="p"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打印机位置" prop="Place">
            <el-input v-model="editForm.Place" placeholder="请输入打印机所在位置，如 主楼1112"></el-input>
          </el-form-item>
          <el-form-item label="打印机编号" prop="PID">
            <el-input v-model="editForm.PID" placeholder="请自定打印机编号，如 12"></el-input>
          </el-form-item>
          <el-row justify="end">
            <el-form-item>
              <el-button type="primary" @click="editConfirm();EditVisible = false">确认修改</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </el-tab-pane>


    <el-tab-pane label="注册新打印机">
      <el-form :model="regForm" :rules="regRules" ref="regRef" label-width="140px">
        <el-form-item label="选择本地打印机" prop="PrinterName">
          <el-select v-model="regForm.PrinterName" placeholder="请选择要添加的本地打印机" @click="getLocalPrinter">
            <el-option v-for="p in localPrinter" :label="p" :value="p" :key="p"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印机位置" prop="Place">
          <el-input v-model="regForm.Place" placeholder="请输入打印机所在位置，如 主楼1112"></el-input>
        </el-form-item>
        <el-form-item label="打印机编号" prop="PID">
          <el-input v-model="regForm.PID" placeholder="请自定打印机编号，如 12"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPrinter">添加打印机</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>


<script>
import {
  ref,
  reactive,
  unref,
} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  Delete,
  Setting,
  Avatar,
  Refresh,
  RefreshLeft,
} from '@element-plus/icons-vue'



export default {

  name: 'Home',
  setup() {
    const regForm = reactive({
      PrinterName: '',
      Place: '',
      PID: '',
    })
    const editForm = reactive({
      PrinterName: '',
      Place: '',
      PID: '',
      PrinterID: '',
    })
    const pForm = reactive({
      AllowPasswd: true,
      AllowAll: "所有用户",
      PrinterID: '',
    })
    const userForm = reactive({
      PrinterID: '',
      UserID: ''
    })
    const tabPosition = ref('top')
    const dialogVisible = ref(false)
    const EditVisible = ref(false)
    const innerVisible = ref(false)
    const userVisible = ref(false)
    const regRef = ref()
    const editRef = ref()
    const addUserRef = ref()
    const delUserRef = ref()
    const privilegeRef = ref()
    const regRules = reactive({
      Place: [
        {required: true, message: "请输入打印机所在地址", trigger: "blur"}
      ],
      PID: [
        {required: true, message: "请输入打印机编号", trigger: "blur"}
      ],
      PrinterName: [
        {required: true, message: "请选择需要绑定的打印机名称", trigger: "blur"}
      ]
    })


    return {
      regForm,
      editForm,
      userForm,
      tabPosition,
      regRules,
      editRef,
      privilegeRef,
      regRef,
      addUserRef,
      delUserRef,
      dialogVisible,
      EditVisible,
      innerVisible,
      userVisible,
      pForm,
      Delete,
      Setting,
      Avatar,
      Refresh,
      RefreshLeft,
    }
  },

  data() {
    return {
      printerInfo: [],
      localPrinter: [],
      authorizedUsers: [],
    }
  },
  mounted() {
    this.getPrinterAdded();
  },
  methods: {
    getPrinterAdded() {
      this.axios.get("http://localhost:12381/GetPrinterAdded").then(res => {
        if (res.status === 200) {
          if (res.data == null) {
            this.printerInfo = []
            ElMessage({
              message: '已添加打印机列表为空，请注册打印机',
              type: 'info',
            })
          } else {
            this.printerInfo = res.data;
            ElMessage({
              message: '刷新成功',
              type: 'success',
            })
          }

        } else {
          ElMessage.error("内部错误，获取已添加打印机失败")
        }
      }).catch(function () {
        ElMessage.error("内部错误，获取已添加打印机失败")
      });
    },
    getLocalPrinter() {
      this.axios.get("http://localhost:12381/GetLocalPrinter").then(res => {
        if (res.status === 200) {
          this.localPrinter = res.data;
        } else {
          ElMessage.error("内部错误，无法获取本地打印机")
        }
      }).catch(function (error) {
        ElMessage.error("网络错误，无法获取本地打印机")
        console.log(error);
      });
    },
    addPrinter() {
      const form = unref(this.regRef)
      if (!form) {
        return
      }
      try {
        const valid = form.validate()
        if (valid) {
          this.axios.post("http://localhost:12381/RegisterPrinter",
              this.regForm
          ).then(res => {
            if (res.status === 200) {
              ElMessage({
                message: '注册打印机成功',
                type: 'success',
              })
              this.getPrinterAdded()
            } else {
              ElMessage.error("注册打印机失败")
            }
          }).catch(function (error) {
            ElMessage.error("网络错误")
            console.log(error);
          });
        }
      } catch (err) {
        ElMessage.error("注册打印机失败")
        console.log(err)
      }
    },
    delPrinter(pID) {
      ElMessageBox.confirm(
          '确定要删除打印机：' + pID,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            try {
              this.axios.post("http://localhost:12381/DeletePrinter",
                  pID
              ).then(res => {
                if (res.status === 200) {
                  ElMessage({
                    message: '删除打印机成功',
                    type: 'success',
                  })
                  this.getPrinterAdded()
                } else {
                  ElMessage.error("删除打印机失败")
                }
              }).catch(function (error) {
                ElMessage.error("网络错误")
                console.log(error);
              });
            } catch (err) {
              ElMessage.error("删除打印机失败")
              console.log(err)
            }

          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '删除取消',
            })
          })
    },
    resetPasswd(pID) {
      ElMessageBox.confirm(
          '确定要重置打印机：' + pID +' 密码',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            try {
              this.axios.post("http://localhost:12381/ResetPasswd",
                  pID
              ).then(res => {
                if (res.status === 200) {
                  ElMessage({
                    message: '重置打印机密码成功',
                    type: 'success',
                  })
                  this.getPrinterAdded()
                } else {
                  ElMessage.error("重置打印机密码失败")
                }
              }).catch(function (error) {
                ElMessage.error("网络错误")
                console.log(error);
              });
            } catch (err) {
              ElMessage.error("重置打印机密码失败")
              console.log(err)
            }

          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '重置取消',
            })
          })
    },


    editPrinter(data) {
      this.editForm.PrinterID = data.PrinterID
      const nickName = data.NickName
      this.editForm.PID = nickName.split("_")[1]
      this.editForm.Place = nickName.split("_")[0]
      this.editForm.Pass = data.GuestPass
      this.editForm.PrinterName = data.PrinterName
    },
    editConfirm() {
      const form = unref(this.editRef)
      if (!form) {
        return
      }
      try {
        const valid = form.validate()
        if (valid) {
          this.axios.post("http://localhost:12381/EditPrinter",
              this.editForm
          ).then(res => {
            if (res.status === 200) {
              ElMessage({
                message: '修改打印机成功',
                type: 'success',
              })
              this.getPrinterAdded()
            } else {
              ElMessage.error("修改打印机失败")
            }
          }).catch(function (error) {
            ElMessage.error("网络错误")
            console.log(error);
          });
        }
      } catch (err) {
        ElMessage.error("修改打印机失败")
        console.log(err)
      }
    },
    editPrivilege(data) {
      this.pForm.PrinterID = data.PrinterID
      this.pForm.AllowAll = data.AllowAll
      this.pForm.AllowPasswd = data.AllowPasswd
      this.userForm.PrinterID = this.pForm.PrinterID
    },
    handlePrivilegeChange() {
      const form = unref(this.privilegeRef)
      console.log(form)
      if (!form) {
        return
      }
      try {
        this.axios.post("http://localhost:12381/EditPrinterPrivilege",
            this.pForm
        ).then(res => {
          if (res.status === 200) {
            ElMessage({
              message: '修改打印机权限成功',
              type: 'success',
            })
            this.getPrinterAdded()
          } else {
            ElMessage.error("修改打印机权限失败")
          }
        }).catch(function (error) {
          ElMessage.error("网络错误")
          console.log(error);
        });
      } catch (err) {
        ElMessage.error("修改打印机权限失败")
        console.log(err)
      }
    },
    getAuthorizedUser() {
      this.axios.get("http://localhost:12381/GetAuthorizedUsers", {params: {PrinterID: this.pForm.PrinterID}}).then(res => {
        if (res.status === 200) {
          this.authorizedUsers = res.data
        } else {
          ElMessage.error("内部错误，无法获取已授权用户")
        }
      }).catch(function (error) {
        ElMessage.error("网络错误，无法获取已授权用户")
        console.log(error);
      });
    },
    addAuthorizedUser() {
      const form = unref(this.addUserRef)
      console.log(form)
      if (!form) {
        return
      }
      try {
        const valid = form.validate()
        if (valid) {
          this.axios.post("http://localhost:12381/AddAuthorizedUser",
              this.userForm
          ).then(res => {
            if (res.status === 200) {
              ElMessage({
                message: '添加授权用户成功',
                type: 'success',
              })
              this.getAuthorizedUser()
            } else {
              ElMessage.error("添加授权用户失败")
            }
          }).catch(function (error) {
            ElMessage.error("网络错误")
            console.log(error);
          });
        }
      } catch (err) {
        ElMessage.error("添加授权用户失败")
        console.log(err)
      }
    },
    delAuthorizedUser(userName) {
      ElMessageBox.confirm(
          '确定要删除授权用户：' + userName,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            try {
              this.axios.post("http://localhost:12381/DelAuthorizedUser",
                  {"PrinterID": this.userForm.PrinterID, "UserID": userName}
              ).then(res => {
                if (res.status === 200) {
                  ElMessage({
                    message: '删除授权用户成功',
                    type: 'success',
                  })
                  this.getAuthorizedUser()
                } else {
                  ElMessage.error("删除授权用户失败")
                }
              }).catch(function (error) {
                ElMessage.error("网络错误")
                console.log(error);
              });
            } catch (err) {
              ElMessage.error("删除授权用户失败")
              console.log(err)
            }
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '删除取消',
            })
          })
    },
  },
}
</script>




