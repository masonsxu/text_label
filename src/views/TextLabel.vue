<template>
  <div id="text_label">
    <el-card>
      <el-row :gutter="20"
        ><i class="el-icon-s-home"></i> <span>原文</span>
      </el-row>
      <el-row :gutter="20"
        ><span>{{ text }} </span></el-row
      >
    </el-card>
    <el-card>
      <el-row :gutter="20"
        ><el-col :span="8">实体标注</el-col
        ><el-col :span="8"
          ><el-button @click="updateText">开始标注</el-button></el-col
        ></el-row
      >
      <el-row :gutter="20">
        <el-col :span="8">
          <div style="margin-top:20px">
            <span style="font-weight:600;">预标注:{{ text_pre }}</span>
            <el-input style="width:65%;margin-left:22px;"> </el-input></div
        ></el-col>
        <el-col :span="8">
          <div style="margin-top:20px">
            <span style="font-weight:600;">替换为:{{ text_pre }}</span>
            <el-input style="width:65%;margin-left:22px;"> </el-input></div
        ></el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <!-- <el-col :span="4">{{ resp_values }}</el-col> -->
        <div
          style="
          padding: 0 15px;
          border-style: grrove;
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
        "
        >
          <div v-for="(entity, index) in entities" :key="(entity, index)">
            <p
              style="
              margin: 0;
              line-height: 30px;
              font-weight: 580;
              padding: 0 16px;
            "
            >
              {{ entity }}
            </p>
            <p
              style="
              margin: 0;
              line-height: 20px;
              font-size: 12px;
              padding: 0 16px;
            "
            >
              {{ resp_values[index] }}
            </p>
          </div>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entities: [],
      resp_values: [],
      text: "null",
      text_pre: null
    };
  },
  methods: {
    updateText() {
      this.$axios
        .get(`/api/get_text`)
        .then(res => {
          this.text = res.data.data[0].text;
          let resp = res.data.data[0].label_pre;
          let temp = [];
          let value_temp = [];
          if (res.status == 200) {
            for (let i in resp) {
              temp.push(String(resp[i]["item"]));
              this.entities = temp;
              value_temp.push(String(resp[i]["pos"]));
              this.resp_values = value_temp;
            }
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
