<template>
<div :class="$style.root">
    <div v-for="item in list" :key="item.id">{{ var1 }}</div>
    <u-linear-layout>
        <u-button @click="test()"></u-button>
        <u-pagination></u-pagination>
    </u-linear-layout>
    <u-transfer :class="$style.root1" :source="source" :target="target">
        <div v-for="item in list1" :key="item.id" :title="var2">{{ var2 }}</div>
    </u-transfer>
</div>
</template>

<script>
import UWorkflow from '@cloud-ui/u-workflow.vue';
const source = [
    { text: 'C', value: 'c' },
    { text: 'C#', value: 'csharp' },
    { text: 'C++', value: 'cpp' },
    { text: 'Coq', value: 'coq' },
    { text: 'Go', value: 'go' },
    { text: 'Handlebars', value: 'Handlebars' },
    { text: 'JSON', value: 'json' },
    { text: 'Java', value: 'java' },
    { text: 'Makefile', value: 'makefile' },
    { text: 'Markdown', value: 'markdown' },
    { text: 'Objective-C', value: 'objective-c' },
    { text: 'Objective-C++', value: 'objective-cpp' },
    { text: 'PHP', value: 'php' },
    { text: 'Perl', value: 'perl' },
    { text: 'PowerShell', value: 'powershell' },
    { text: 'Python', value: 'python' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'SQL', value: 'sql' },
    { text: 'SVG', value: 'svg' },
    { text: 'Shell Script', value: 'shellscript' },
    { text: 'Swift', value: 'swift' },
    { text: 'Visual Basic', value: 'vb' },
    { text: 'XML', value: 'xml' },
    { text: 'YAML', value: 'yaml' },
];
const target = [
    { text: 'CSS', value: 'css' },
    { text: 'HTML', value: 'html' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'Vue', value: 'vue' },
];
export default {
    components: { UWorkflow },
    data() {
        return {
            var1: undefined,
            list: [],
            model: { instance: {} },
            source,
            target,
            var2: 123,
            list1: ['aaa'],
        };
    },
    computed: {
        showButton() {
            return false;
        },
    },
    created() {
        console.log('created1');
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

.root1 {
    height: 300px;
}

:global .white {
    color: white;
}

.root1 .item1 {
    color: black;
}

@media (max-width: 600px) {
    .root1 {
        width: 50%;
    }
}
</style>
