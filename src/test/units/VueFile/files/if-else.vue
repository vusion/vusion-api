<template>
<div>
    <span v-if="cond === 0"></span>
    <span v-else-if="cond === 1"></span>
    <span v-else></span>
</div>
</template>

<script>
export default {
    data() {
        return {
            cond: 0,
        };
    },
};
</script>

<style module>
.root {}

.link[active] {
    color: #67aaf5;
}
</style>
