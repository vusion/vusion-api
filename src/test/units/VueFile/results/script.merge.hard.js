import OTest from './o-test.vue';
import { USubscribe } from 'cloud-ui.vusion';
export default {
    name: 'u-test',
    childName: 'u-test-item',
    extends: OTest,
    mixins: [USubscribe],
    watch: {
        test() {
            return false;
        },
        test1() {
            return false;
        },
    },
    created() {
        console.log('created1');
        console.log('created1');
    },
};
