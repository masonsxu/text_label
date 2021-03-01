<template>
  <!-- <img src="./assets/logo.png" />
  <div>
    <p>
      If Element Plus is successfully added to this project, you'll see an
      <code v-text="'<el-button>'"></code>
      below
    </p>
    <el-button type="primary">el-button</el-button>
  </div>
  <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <div id="app">
    <el-container>
      <el-header style="font-weight:700;font-size:18px;">
        {{ mseeage.title }}
      </el-header>
      <!-- <router-view></router-view> -->
      <TextLabel msg="TextLabel" />
      <el-footer>{{ mseeage.footer }}</el-footer>
    </el-container>
  </div>
</template>

<script>
import TextLabel from "./views/TextLabel";

export default {
  name: "App",
  data() {
    return {
      mseeage: {
        title: "突发事件本体模型与知识图谱的构建设计与实现——数据标注系统",
        footer: "地址：河南省平顶山市新城区龙翔大道  河南城建学院版权所有"
      }
    };
  },
  components: {
    TextLabel
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
