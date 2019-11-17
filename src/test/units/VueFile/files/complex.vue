<template>
<div :class="$style.root">
    <span>ABC</span>
    <component v-for="item in list" :key="item.ccc" :is="red" test="bbb" :area="ccc">ABC</component>
    inside {{ abc }}
    <div v-for="item in list" v-tooltip="'efefe'" v-bind="taaa" :key="item.id">{{ item.name }}</div>
</div>
</template>
