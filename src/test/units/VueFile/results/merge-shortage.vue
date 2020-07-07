<template>
<div :class="$style.root">
    <div v-for="item in list" :key="item.id">{{ var1 }}</div>
    <u-linear-layout>
        <u-button @click="test()"></u-button>
        <u-pagination></u-pagination>
    </u-linear-layout>
    <s-login src="http://nuims.vusion.top"></s-login>
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

.root .item {
    color: blue;
}

:global .red {
    background: red;
}

@media (max-width: 600px) {
    .test {
        width: 30%;
    }
}
</style>
