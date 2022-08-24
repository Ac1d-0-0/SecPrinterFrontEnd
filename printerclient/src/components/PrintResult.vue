<template>
  <el-row>
    <el-col class="center">
      <el-result
          icon="success"
          title="打印成功"
          sub-title="点击返回主页面"
      >
      </el-result>
      <el-button type="primary" @click="goBack()">返回</el-button>
    </el-col>
  </el-row>
</template>
<script>
import {useStore} from "vuex";

export default {
  name: "PrintResult",
  setup: function () {
    const store = new useStore();
    return {
      store
    }
  },
  methods:{
    goBack(){
      this.store.state.active=2
    }
  }
}
</script>

<style scoped>

</style>

