<script>
import {createStore} from 'vuex'



const store = createStore({
  state() {
    return {
      //use for global config
      serverAddr: "http://127.0.0.1:8080/api/",

      //use for view
      ifLogin: false,
      username: null,
      passwd: null,
      printerList: [],
      result: null,
      firstSet: true,
      //进度条
      active: 0,
      guest_active: 0,
      //模式 1为client 0为guest
      mode: 1,
      mountTime: 0
    }
  }
});
export default store;

</script>

<style scoped>

</style>