<template>
<div :class="$style.root">
    <span>ABC</span>
    inside {{ abc }}
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
</div>
</template>
