import { defineStore } from "pinia";
import { ref } from "vue";
let useSettingStore = defineStore("Setting", {
  state: () => {
    return {
      dark: "",
    };
  },
  actions: {
    changeStatus(status) {
      this.dark = status;
    },
  },
});
export default useSettingStore;
