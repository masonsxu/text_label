import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import installElementPlus from "./plugins/element";

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(installElementPlus);
app.use(store);
app.use(router);
app.mount("#app");
