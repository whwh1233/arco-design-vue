```yaml
meta:
  type: 组件
  category: 数据输入
title: 级联选择 Cascader
description: 指在选择器选项数量较多时，采用多级分类的方式将选项进行分隔。
```

@import ./__demo__/basic.md

@import ./__demo__/clear.md

@import ./__demo__/disabled.md

@import ./__demo__/format.md

@import ./__demo__/multiple.md

@import ./__demo__/search.md

@import ./__demo__/path.md


### `<cascader>` Props

|参数名|描述|类型|默认值|
|---|---|---|:---:|
|path-mode|绑定值是否为路径|`boolean`|`false`|
|multiple|是否为多选状态|`boolean`|`false`|
|model-value **(v-model)**|绑定值|`string \| string[] \| undefined \| (string \| string[])[]`|`-`|
|default-value|默认值（非受控状态）|`string \| string[] \| undefined \| (string \| string[])[]`|`'' | undefined | []`|
|options|级联选择器的选项|`CascaderOption[]`|`[]`|
|disabled|是否禁用|`boolean`|`false`|
|error|是否为错误状态|`boolean`|`false`|
|allow-search|是否允许搜索|`boolean`|`false`|
|allow-clear|是否允许清除|`boolean`|`false`|
|input-value **(v-model)**|输入框的值|`string`|`-`|
|default-input-value|输入框的默认值（非受控状态）|`string`|`''`|
|popup-visible **(v-model)**|是否显示下拉框|`boolean`|`-`|
|expand-trigger|展开下一级的触发方式|`string`|`'click'`|
|default-popup-visible|是否默认显示下拉框（非受控状态）|`boolean`|`false`|
|placeholder|占位符|`string`|`-`|
|popup-container|弹出框的挂载容器|`string \| HTMLElement \| null \| undefined`|`-`|
|format-label|格式化展示内容|`(options: CascaderOptionInfo[]) => string`|`-`|
### `<cascader>` Events

|事件名|描述|参数|
|---|---|---|
|change|选中值改变时触发|value: `string \| string[] \| undefined \| (string \| string[])[]`|
|input-value-change|输入值改变时触发|value: `string`|
|clear|点击清除按钮时触发|-|
|search|用户搜索时触发|value: `string`|
|popup-visible-change|下拉框的显示状态改变时触发|visible: `boolean`|
|focus|获得焦点时触发|-|
|blur|失去焦点时触发|-|

