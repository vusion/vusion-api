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
        this.var2 = 2;
        this.list1.push('bbb');
        console.log('created1');
    },
    methods: {
        test() {
            console.info('aaa');
        },
    },
};
