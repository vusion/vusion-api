import { MGroup } from '../../m-group.vue';

export const USidebarGroup = {
    name: 'u-sidebar-group',
    parentName: 'u-sidebar',
    childName: 'u-sidebar-item',
    extends: MGroup,
    computed: {
        selected() {
            return this.itemVMs.some((item) => item.active);
        },
    },
    methods: {
        toggle(expanded, mode) {
            this.currentExpanded = expanded;
            this.$emit('update:expanded', expanded);

            if (this.parentVM.accordion || mode) {
                this.parentVM.groupVMs.forEach((groupVM) => {
                    if (groupVM !== this) {
                        groupVM.currentExpanded = false;
                        groupVM.$emit('update:expanded', false);
                    }
                });
            }
        },
    },
};

export default USidebarGroup;
