<template>
<u-linear-layout></u-linear-layout>
</template>

<script>
import xxxService from '../services';

export default {
    data() {
        return {
            // data
        };
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            xxxService.getList();
        },
    },
};
</script>
