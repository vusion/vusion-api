# USample 样本组件

这里是样本组件的基本描述。

## 示例
### 基本形式

基本形式是这样的，Balabala。

![](screenshots/1.png)

<!-- 这里用`htm`，防止生成 demo -->
``` htm
<u-sample some-prop></u-sample>
```

### 复杂示例

![](screenshots/2.png)

<!-- 这里用`htm`，防止生成 demo -->
``` htm
<template>
<u-sample v-model="value">
    <div>Something</div>
</u-sample>
</template>

<script>
export default {
    data() {
        return {
            value: 3,
        };
    },
};
</script>
```

## API
### Props/Attrs

| Prop/Attr | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| v-model, value.sync | Number | `1` | 主要的值 |
| some | Boolean | `false` | 一些 |
| other | String | | 其他的 |
| prop | Array | | 属性 |
| disabled | Boolean | `false` | 是否禁用 |

### Events

#### @before-action

操作前触发

| Param | Type | Description |
| ----- | ---- | ----------- |
| $event.value | String | 传递的值 |
| $event.content | String | 传递的内容 |
| $event.preventDefault | Function | 阻止关闭流程 |
| senderVM | USample | 发送事件实例 |

#### @action

操作时触发

| Param | Type | Description |
| ----- | ---- | ----------- |
| $event.page | Number | 当前页码 |
| $event.oldPage | Number | 旧的页码 |
| senderVM | USample | 发送事件实例 |

#### @change

值改变时触发

| Param | Type | Description |
| ----- | ---- | ----------- |
| $event.value | Number | 当前值 |
| $event.oldValue | Number | 旧的值 |
| senderVM | UComboPagination | 发送事件实例 |

### Methods

#### load()

加载。

| Param | Type | Description |
| ----- | ---- | ----------- |

### toggle(expanded)

切换状态。

| Param | Type | Description |
| ----- | ---- | ----------- |
| expanded | Boolean | 展开/折叠 |
