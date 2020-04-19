<template>
<div :class="$style.root">
    <div v-for="item in list" :key="item.id">{{ var1 }}</div>
    <u-linear-layout>
        <u-button @click="test()"></u-button>
        <u-pagination></u-pagination>
    </u-linear-layout>
</div>
</template>

<script>
import UWorkflow from '@cloud-ui/u-workflow.vue';

export default {
    components: { UWorkflow },
    data() {
        return {
            var1: undefined,
            list: [],
            model: {
                instance: {},
            },
        };
    },
    computed: {
        showButton() {
            return false;
        },
    },
    methods: {
        test() {
            console.info('aaa');
        },
    },
};
</script>

<style module>
.root {
    width: 100%;
}
</style>
