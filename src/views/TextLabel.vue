<template>
  <div id="text_label">
    <el-card>
      <el-row><i class="el-icon-s-opportunity">标注规则</i></el-row>
      <el-row>
        标注方式：BIO标注（其中B代表Begin，指代实体的开始，I代表Inner，指代实体内部，O代表Other，指代不属于实体的字）
        <br />标点符号一律标注为O <br />实体种类：<br />时间—TIME <br />地点—LOC
        <br />人物—PER <br />机构/组织—ORG <br />结果—RES
      </el-row>
    </el-card>
    <el-card>
      <el-row
        ><el-col :span="10"
          ><el-button @click="updateText">开始标注</el-button
          ><el-button @click="cancelLabel">撤回</el-button
          ><el-button @click="saveAndNext">下一篇</el-button>
          <el-button @click="resetLabelFlag">退出当前文本标注</el-button>
        </el-col></el-row
      >
      <el-row :gutter="20"><i class="el-icon-s-home">原文</i> </el-row>
      <el-skeleton :rows="1" :loading="loading" animated>
        <el-row
          :gutter="20"
          @mouseup="handleMouseSelect"
          type="flex"
          justify="center"
        >
          <span style="width:95%">
            <span v-for="item in abstract_label" :key="item.text"
              ><el-tag>{{ item.text }}</el-tag>
              <el-tooltip
                :disabled="tooltip_disabled"
                placement="bottom"
                effect="light"
              >
                <template #content>
                  鼠标左击可建立关系<br />鼠标右击，可"取消/修改"实体标签
                  <br /><el-button
                    type="text"
                    size="mini"
                    @click="tooltip_disabled = !tooltip_disabled"
                    >不再提示</el-button
                  ></template
                >
                <el-button
                  id="verb_list"
                  size="small"
                  @mousedown="verb_choose(item.text, $event)"
                  >{{ item.label }}</el-button
                ></el-tooltip
              >
            </span>
            {{ text }}
          </span>
        </el-row></el-skeleton
      >
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table :data="table_data" height="160" border style="width: 100%">
            <el-table-column prop="text_pre" label="标注字段">
            </el-table-column>
            <el-table-column prop="text_label" label="标注结果">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table :data="spo_list" height="160" border style="width: 100%">
            <el-table-column prop="subject_type" label="主语(S)">
            </el-table-column>
            <el-table-column prop="predicate" label="谓语(P)"> </el-table-column
            ><el-table-column prop="object_type" label="宾语(O)">
            </el-table-column> </el-table
        ></el-col>
      </el-row>
    </el-card>
    <el-radio-group
      v-model="value"
      placeholder="请选择"
      v-show="flag == null ? show : !show"
    >
      <el-radio-button
        v-for="item in lable_options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click.prevent="textLabel(item.value)"
      ></el-radio-button>
    </el-radio-group>
    <el-select
      v-model="value"
      placeholder="请选择"
      v-show="predicate == null ? show : !show"
    >
      <el-option
        v-for="item in predicate_options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click.prevent="preLabel(item.value)"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      show: false,
      loading: true,
      tooltip_disabled: false,
      end: 0,
      bagin: 0,
      text_height: 0,
      flag: null,
      text: null,
      value: null,
      predicate: null,
      abstract: null,
      text_pre: null,
      text_label: null,
      spo_dict: {},
      spo_list: [],
      table_data: [],
      abstract_label: [],
      lable_options: [
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
      predicate_options: [
        {
          value: "祖籍",
          label: "祖籍"
        },
        {
          value: "父亲",
          label: "父亲"
        },
        {
          value: "总部地点",
          label: "总部地点"
        },
        {
          value: "出生地",
          label: "出生地"
        },
        {
          value: "面积",
          label: "面积"
        },
        {
          value: "简称",
          label: "简称"
        },
        {
          value: "作者",
          label: "作者"
        },
        {
          value: "成立日期",
          label: "成立日期"
        },
        {
          value: "总部地点",
          label: "总部地点"
        },
        {
          value: "出生日期",
          label: "出生日期"
        },
        {
          value: "首都",
          label: "首都"
        },
        {
          value: "身高",
          label: "身高"
        }
      ]
    };
  },
  methods: {
    updateText() {
      if (this.text == null) {
        this.$axios
          .get(`/api/get_text`)
          .then(res => {
            this.abstract = this.text = res.data.abstract;
            this.loading = false;
          })
          .catch(error => {
            ElMessage.warning({
              message: error,
              type: "warning",
              center: true
            });
          });
      } else {
        ElMessage.warning({
          message:
            "标注未完成，请完成标注后点击继续下一条标注或退出此次标注！！！",
          type: "warning",
          center: true
        });
      }
    },
    cancelLabel() {
      if (this.abstract_label.length != 0) {
        this.table_data.pop();
        let textLabel_dict = this.abstract_label.pop();
        this.text = textLabel_dict.text + this.text;
        ElMessage.success({
          message: '取消"' + textLabel_dict.text + '"的标记',
          type: "success",
          center: true
        });
      } else {
        ElMessage.warning({
          message: "没有被标注文本！！！",
          type: "warning",
          center: true
        });
      }
    },
    saveAndNext() {
      if (this.text == null) {
        ElMessage.warning({
          message: "未开始文本标注，不需要保存！！！",
          type: "warning",
          center: true
        });
      } else if (this.text.length == 0 && this.text != null) {
        this.$axios
          .post(`/api/saveAndNext`, {
            abstract: this.abstract,
            abstract_label: this.abstract_label
          })
          .then(res => {
            this.end = 0;
            this.bagin = 0;
            this.text = null;
            this.flag = null;
            this.text_pre = null;
            this.abstract = null;
            this.text_label = null;
            this.abstract_label = [];
            this.abstract = this.text = res.data.abstract;
            this.loading = false;
          })
          .catch(error => {
            ElMessage.warning({
              message: error,
              type: "warning",
              center: true
            });
          });
      } else {
        ElMessage.warning({
          message: "标注未完成，请完成标注后进行保存！！！",
          type: "warning",
          center: true
        });
      }
    },
    resetLabelFlag() {
      if (this.abstract != null) {
        this.$axios
          .post(`/api/reset_label_flag`, {
            abstract: this.abstract
          })
          .then(res => {
            this.end = 0;
            this.bagin = 0;
            this.text = null;
            this.flag = null;
            this.spo_dict = null;
            this.text_pre = null;
            this.abstract = null;
            this.text_label = null;
            this.spo_list = [];
            this.table_data = [];
            this.abstract_label = [];
            this.abstract = this.text = res.data.abstract;
            this.loading = true;
            ElMessage.success({
              message: "当前待标注文本已被重置！！！",
              type: "success"
            });
          })
          .catch(error => {
            ElMessage.error({
              message: error,
              type: "error",
              center: true
            });
          });
      } else {
        ElMessage.warning({
          message: "没有读取任何文本，没有文本被重置！！！",
          type: "warning",
          center: true
        });
      }
    },
    handleMouseSelect(event) {
      if (window.getSelection().toString().length > 0) {
        this.bagin = window.getSelection().anchorOffset;
        this.end = window.getSelection().focusOffset;
        this.text_pre = this.flag = window.getSelection().toString();
        let el_radio_group = document.getElementsByClassName(
          "el-radio-group"
        )[0];
        el_radio_group.style.position = "fixed";
        el_radio_group.style.left = String(event.clientX) + "px";
        el_radio_group.style.top = String(event.clientY) + "px";
      } else {
        this.flag = null;
        this.text_pre = null;
        this.text_label = null;
      }
    },
    textLabel(value) {
      if (this.bagin == 1) {
        this.text_label = value;
        this.text = this.text.substring((this.end -= 1));
        this.abstract_label.push({ text: this.flag, label: value });
        this.flag = null;
        this.table_data.push({
          text_pre: this.text_pre,
          text_label: this.text_label
        });
      } else {
        ElMessage.warning({
          message: "请按照顺序进行标注",
          type: "warning",
          center: true
        });
      }
    },
    preLabel(label) {
      this.spo_dict["predicate"] = label;
      this.spo_list.push(this.spo_dict);
      this.spo_dict = {};
      this.predicate = null;
    },
    verb_choose(text, event) {
      if (event.button == 0) {
        ElMessage.info("你点了左键" + event.clientX + " " + event.clientY);
        if (Object.keys(this.spo_dict) == 0) {
          this.spo_dict["subject_type"] = text;
        } else {
          this.predicate = this.spo_dict["object_type"] = text;
          let select_trigger = document.getElementsByClassName(
            "select-trigger"
          )[0];
          select_trigger.style.position = "fixed";
          select_trigger.style.left = String(event.clientX) + "px";
          select_trigger.style.top = String(event.clientY) + "px";
        }
      } else if (event.button == 2) {
        ElMessage.info("你点了右键" + text);
      }
    }
  },
  mounted() {
    this.timer = setInterval(this.resetLabelFlag, 300000);
    window.onbeforeunload = this.resetLabelFlag;
  },
  beforeUnmount() {
    clearInterval(this.timer);
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
p {
  text-indent: 4em;
}
</style>
