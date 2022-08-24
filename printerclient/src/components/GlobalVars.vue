<script>
import {createStore} from 'vuex'



const store = createStore({
  state() {
    return {
      serverAddr: "http://127.0.0.1:12384/api/",
      //use for view
      ifLogin: false,
      username: null,
      passwd: null,
      printerList: [],
      result: null,
      firstSet: true,
      active: 1,
      //模式 1为client 0为guest
      mode: 1,
      mountTime: 0,
      userInfo:"未登录",
      waitPrint:false,
      printResult:"",
    }
  }
});
export default store;

</script>

<style scoped>

</style>