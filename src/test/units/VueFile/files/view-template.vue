<template>
<div class="view">
    <u-text>overview</u-text>
    <u-linear-layout>
        <u-button @click="test()"></u-button>
        <u-pagination></u-pagination>
    </u-linear-layout>
</div>
</template>

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
