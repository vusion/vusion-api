<template>
<div :class="$style.root">
    <u-button ref="button1"></u-button>
</div>
</template>

<script>
export default {
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
