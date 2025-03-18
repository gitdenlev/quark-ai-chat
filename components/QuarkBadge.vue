<script setup lang="ts">
const hover = ref(false);
const props = defineProps({
  iconName: String,
  color: String,
  bgColor: String,
});
</script>

<template>
  <div
    class="select-none cursor-pointer inline-flex items-center px-3 py-1 rounded-full gap-1 my-2 transform-gpu transition-all duration-200"
    :style="{
      color: props.color,
      backgroundColor: props.bgColor,
      filter: hover ? 'opacity(80%)' : 'opacity(100%)',
    }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <Icon :name="props.iconName" size="25" />
    <span class="whitespace-nowrap">
      <slot />
    </span>
  </div>
</template>

<style scoped>
.transform-gpu {
  will-change: transform;
  transform: translateZ(0);
}
</style>
