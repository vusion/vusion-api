<template>
<div :class="$style.root"></div>
</template>

<script>
import service from './service.js';

export default {
    name: 'u-test',
};
</script>

<style module>
@import '../base.css';

.root {
    color: black;
    background: red url('../assets/back.png');
}
</style>
