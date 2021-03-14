<template>
  <div id="text_label">
    <el-card>
      <el-row :gutter="20"
        ><el-col :span="8"
          ><el-button @click="updateText">开始标注</el-button></el-col
        ><el-col :span="8"
          ><el-button @click="saveAndNext">保存进入下一条</el-button></el-col
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
      <el-row :gutter="20"><i class="el-icon-s-home">原文</i> </el-row>
      <el-row
        :gutter="20"
        @mouseup="handleMouseSelect"
        type="flex"
        justify="center"
      >
        <span style="width:95%">
          <span v-for="item in abstract_label" :key="item.text"
            ><el-tag>{{ item.text }}</el-tag>
            <el-tag type="success">{{ item.label }}</el-tag></span
          >
          {{ text }}
        </span>
      </el-row>
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
      end: 0,
      bagin: 0,
      text_height: 0,
      flag: "",
      text: "",
      abstract: "",
      text_pre: "",
      text_label: "",
      abstract_label: [],
      options: [
        {
          value: "LOC",
          label: "LOC"
        },
        {
          value: "RES",
          label: "RES"
        },
        {
          value: "TIME",
          label: "TIME"
        },
        {
          value: "PER",
          label: "PER"
        },
        {
          value: "ORG",
          label: "ORG"
        },
        {
          value: "O",
          label: "O"
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
          this.abstract = this.text = res.data.abstract;
        })
        .catch(error => console.log(error));
    },
    handleMouseSelect() {
      let loc = window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect();
      this.bagin = window.getSelection().anchorOffset;
      this.end = window.getSelection().focusOffset;
      this.text_pre = this.flag = window.getSelection().toString();
      let el_radio_group = document.getElementsByClassName("el-radio-group")[0];
      el_radio_group.style.position = "absolute";
      el_radio_group.style.top = String(loc.bottom) + "px";
      if (this.text_height == 0) {
        el_radio_group.style.left = String(loc.left + loc.width) + "px";
        this.text_height = loc.height;
      } else if (this.text_height != 0 && loc.height == this.text_height) {
        el_radio_group.style.left = String(loc.left + loc.width) + "px";
      } else {
        el_radio_group.style.left = String(loc.left + loc.left) + "px";
      }
    },
    textLabel(value) {
      if (this.bagin == 1) {
        this.text_label = value;
        this.text = this.text.substring((this.end -= 1));
        this.abstract_label.push({ text: this.flag, label: value });
        this.flag = "";
      } else {
        alert("请按照顺序进行标注");
      }
    },
    saveAndNext() {
      if (this.text.length == 0) {
        this.$axios
          .post(`/api/saveAndNext`, {
            abstract: this.abstract,
            abstract_label: this.abstract_label
          })
          .then(res => {
            this.end = 0;
            this.bagin = 0;
            this.text = "";
            this.flag = "";
            this.text_pre = "";
            this.abstract = "";
            this.text_label = "";
            this.abstract_label = [];
            this.abstract = this.text = res.data.abstract;
          })
          .catch(error => console.log(error));
      } else {
        alert("标注未完成，请完成标注后进行保存！！！");
      }
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
