<script setup lang="ts">
const props = defineProps({
  iconName: String,
  color: String,
});
</script>

<template>
  <div
    class="select-none cursor-pointer inline-flex items-center px-3 py-1 rounded-full gap-1 my-2 transform-gpu transition-all duration-200"
    :class="[`bg-${props.color}-100`, `text-${props.color}-700`]"
    :hover="{
      backgroundColor: `bg-${props.color}-50)`,
    }"
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

div:hover {
  filter: opacity(80%);
}
</style>
