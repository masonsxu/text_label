<template>
  <div class="common-layout" @contextmenu.prevent>
    <el-container>
      <el-header style="font-weight: 700;font-size: 36px;">
        {{ mseeage.title }}
      </el-header>
      <el-main><router-view></router-view></el-main>
      <el-footer>{{ mseeage.footer }}</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      mseeage: {
        title: "突发事件类型及要素标注子系统",
        footer: "地址：河南省平顶山市新城区龙翔大道  河南城建学院版权所有"
      }
    };
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
