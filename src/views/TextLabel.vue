<template>
  <div id="text_label">
    <el-card>
      <el-row :gutter="20"
        ><el-col :span="8"
          ><el-button @click="updateText">开始标注</el-button></el-col
        ><el-col :span="8"
          ><el-button @click="updateText">下一个</el-button></el-col
        ></el-row
      >
      <el-row :gutter="20">
        <el-col :span="8">
          <div style="margin-top:20px">
            <span style="font-weight:600;">标注字段:</span>
            <el-input
              style="width:65%;margin-left:22px;"
              v-model="text_pre"
            ></el-input></div
        ></el-col>
        <el-col :span="8">
          <div style="margin-top:20px">
            <span style="font-weight:600;">标注为:</span>
            <el-input style="width:65%;margin-left:22px;" v-model="text_label">
            </el-input></div
        ></el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row :gutter="20"
        ><i class="el-icon-s-home"></i> <span>原文</span>
      </el-row>
      <el-row :gutter="20" @mouseup="handleMouseSelect"
        ><span>{{ text }} </span></el-row
      >
    </el-card>
    <el-radio-group
      v-model="value"
      placeholder="请选择"
      v-show="flag == '' ? show : !show"
    >
      <el-radio-button
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click.prevent="textLabel(item.value)"
      ></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      text: "",
      text_pre: "",
      text_label: "",
      flag: "",
      options: [
        {
          value: "LOC",
          label: "LOC"
        },
        {
          value: "RES",
          label: "RES"
        }
      ],
      value: ""
    };
  },
  methods: {
    updateText() {
      this.$axios
        .get(`/api/get_text`)
        .then(res => {
          this.text = res.data.data[0].text;
        })
        .catch(error => console.log(error));
    },
    handleMouseSelect() {
      let text = window.getSelection().toString();
      this.text_pre = this.flag = text;
    },
    textLabel(value) {
      this.text_label = value;
      this.text = this.text.replace(this.flag, this.flag + "/" + value + " ");
      this.flag = "";
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
