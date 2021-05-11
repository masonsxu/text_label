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
          <el-button @click="resetLabelFlag">退出当前文本标注</el-button
          ><el-select
            v-model="value"
            placeholder="突发事件所属类型"
            v-show="text == null ? show : !show"
          >
            <el-option
              v-for="item in emergency_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click.prevent="emergencyLabel(item.label, item.value)"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
            </el-option>
          </el-select>
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
            <span v-for="item in abstract_label" :key="item.word"
              ><el-tag>{{ item.word }}</el-tag>
              <el-tooltip
                :disabled="tooltip_disabled"
                placement="bottom"
                effect="light"
              >
                <template #content>
                  鼠标左击可建立关系<br />鼠标右键可以取消当前“SPO”标注
                  <br /><el-button
                    type="text"
                    size="mini"
                    @click="tooltip_disabled = !tooltip_disabled"
                    >不再提示</el-button
                  ></template
                ><el-button
                  id="verb_list"
                  size="small"
                  :type="button_type == null ? '' : 'success'"
                  @mousedown="verb_choose(item.word, $event)"
                  >{{ item.pos }}</el-button
                >
              </el-tooltip>
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
          <el-table :data="spo_list" height="160" border style="width: 100%"
            ><el-table-column prop="predicate" label="谓语(P)">
            </el-table-column
            ><el-table-column prop="object" label="宾语(O)"> </el-table-column>
            <el-table-column prop="subject" label="主语(S)"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button
                  @click.prevent="deleteRow(scope.$index, spo_list)"
                  type="text"
                  size="small"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table></el-col
        >
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
      abstract: null,
      text_pre: null,
      predicate: null,
      text_label: null,
      button_type: null,
      spo_dict: {},
      spo_list: [],
      table_data: [],
      abstract_label: [],
      emergency_type: [],
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
          value: {
            object_type: "地点",
            predicate: "祖籍",
            subject_type: "人物"
          },
          label: "祖籍"
        },
        {
          value: {
            object_type: "人物",
            predicate: "父亲",
            subject_type: "人物"
          },
          label: "父亲"
        },
        {
          value: {
            object_type: "地点",
            predicate: "总部地点",
            subject_type: "企业"
          },
          label: "总部地点"
        },
        {
          value: {
            object_type: "地点",
            predicate: "出生地",
            subject_type: "人物"
          },
          label: "出生地"
        },
        {
          value: {
            object_type: "Number",
            predicate: "面积",
            subject_type: "行政区"
          },
          label: "面积"
        },
        {
          value: {
            object_type: "Text",
            predicate: "简称",
            subject_type: "机构"
          },
          label: "简称"
        },
        {
          value: {
            object_type: "人物",
            predicate: "作者",
            subject_type: "图书作品"
          },
          label: "作者"
        },
        {
          value: {
            object_type: "Date",
            predicate: "成立日期",
            subject_type: "企业"
          },
          label: "成立日期"
        },
        {
          value: {
            object_type: "Date",
            predicate: "出生日期",
            subject_type: "人物"
          },
          label: "出生日期"
        },
        {
          value: {
            object_type: "城市",
            predicate: "首都",
            subject_type: "国家"
          },
          label: "首都"
        },
        {
          value: {
            object_type: "Number",
            predicate: "身高",
            subject_type: "人物"
          },
          label: "身高"
        }
      ],
      emergency_type_options: [
        {
          value: "Natural disaster",
          label: "自然灾害"
        },
        {
          value: "Accident disaster",
          label: "事故灾害"
        },
        {
          value: "Public health event",
          label: "公共卫生事件"
        },
        {
          value: "Social security incident",
          label: "社会安全事件"
        },
        {
          value: "Other emergencies",
          label: "其他突发事件"
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
        this.text = textLabel_dict.word + this.text;
        ElMessage.success({
          message: '取消"' + textLabel_dict.word + '"的标记',
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
            abstract_label: {
              emergency_type: this.emergency_type,
              postag: this.abstract_label,
              spo_list: this.spo_list
            }
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
            this.emergency_type = [];
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
            this.emergency_type = [];
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
        this.abstract_label.push({ word: this.flag, pos: value });
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
    preLabel(value) {
      value["object"] = this.spo_dict["object_type"];
      value["subject"] = this.spo_dict["subject_type"];

      this.spo_list.push(value);
      this.button_type = null;
      this.predicate = null;
      this.spo_dict = {};
    },
    emergencyLabel(label, value) {
      this.emergency_type.push({ Chinese: label, English: value });
    },
    verb_choose(text, event) {
      if (event.button == 0) {
        if (Object.keys(this.spo_dict) == 0) {
          this.spo_dict["subject_type"] = text;
          this.button_type = "success";
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
        if (Object.keys(this.spo_dict) != 0) {
          this.button_type = null;
          this.predicate = null;
          this.spo_dict = {};
          ElMessage.success({
            message: "取消当前“SPO”的标记",
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
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
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
