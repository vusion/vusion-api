### 基本形式

基本形式是这样的，Balabala。

``` html
<u-sample some-prop></u-sample>
```

### 复杂示例

``` vue
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
