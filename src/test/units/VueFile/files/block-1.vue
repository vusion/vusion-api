<template>
<u-transfer :class="$style.root" :source="source" :target="target">
    <div v-for="(item, index) in list" :key="item.id" :title="var1">{{ var1 }}</div>
    <tr v-for="(item, index) in list" :key="index">
        <u-input size="huge full" placeholder="请输入区域" v-model="item.region"></u-input>
    </tr>
</u-transfer>
</template>
<script>
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
    data() {
        return {
            source,
            target,
            var1: 123,
            list: ['aaa'],
        };
    },
    created() {
        this.var1 = 2;
        this.list.push('bbb');
        console.log('created1');
    },
};
</script>

<style module>
.root {
    height: 300px;
}

:global .white {
    color: white;
}

.root .item {
    color: black;
}

@media (max-width: 600px) {
    .root {
        width: 50%;
    }
}
</style>
