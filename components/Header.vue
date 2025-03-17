<script setup lang="ts">
const colorMode = useColorMode();
const activeMode = ref(colorMode.preference);

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const setSystemMode = () => {
  colorMode.preference = "system";
  activeMode.value = "system";
};

const setLightMode = () => {
  colorMode.preference = "light";
  activeMode.value = "light";
};

const setDarkMode = () => {
  colorMode.preference = "dark";
  activeMode.value = "dark";
};
</script>

<template>
  <header class="flex justify-between items-center p-[20px]">
    <div class="flex items-center gap-2">
      <NuxtImg src="./logo.svg" alt="quark" width="32" />
      <h1 class="text-[32px] font-[400]">Quark</h1>
    </div>

    <UPopover
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 12,
        class: 'popover-custom',
      }"
    >
      <Icon
        class="hover:rotate-45 cursor-pointer transition-all duration-300"
        name="bi:gear-wide-connected"
        size="25"
      />

      <template #content>
        <div
          class="flex flex-col p-2 bg-white dark:bg-gray-800 rounded-lg min-w-[200px]"
        >
          <div
            class="flex items-center justify-start gap-2 transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 cursor-pointer transition-all duration-200 group"
                @click="setDarkMode"
                :class="{ active: activeMode === 'dark' }"
              >
                <Icon name="akar-icons:moon" size="22" />
              </div>

              <div
                class="p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-amber-500 cursor-pointer transition-all duration-200 group"
                @click="setLightMode"
                :class="{ active: activeMode === 'light' }"
              >
                <Icon name="pepicons-pop:sun" size="22" />
              </div>

              <div
                class="p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-200 group"
                @click="setSystemMode"
                :class="{ active: activeMode === 'system' }"
              >
                <Icon name="streamline:computer-pc-desktop" size="22" />
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between gap-2 bg-transparent hover:bg-gray-100 rounded-md transition-all duration-200 cursor-pointer mt-2 select-none"
          >
            <div
              class="relative flex items-center gap-2 rounded-3xl p-2 w-full text-gray-700"
            >
              <Icon name="material-symbols-light:language" size="25" />
              <span class="text-lg">Language</span>
              <div class="ml-auto flex items-center gap-1 text-xs">
                <UKbd value="Shift + L" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </header>
</template>

<style scoped>
.active {
  background-color: #e0e0e0;
}

.dark .active {
  background-color: #3f3f3f;
}
</style>
