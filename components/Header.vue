<script setup lang="ts"></script>

<template>
  <header class="flex justify-between items-center p-[20px]">
    <NuxtImg src="./quark.svg" alt="quark" width="120" />
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
          class="flex flex-col p-2 bg-white rounded-lg shadow-lg min-w-[200px] border border-indigo-100"
        >
          <div
            class="flex items-center justify-start gap-2 transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 cursor-pointer transition-all duration-200 group"
              >
                <Icon name="akar-icons:moon" size="22" />
              </div>

              <div
                class="p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-amber-500 cursor-pointer transition-all duration-200 group"
              >
                <Icon name="pepicons-pop:sun" size="22" />
              </div>

              <div
                class="p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-200 group"
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
                <UKbd value="Shift" size="xs" />
                <span>+</span>
                <UKbd value="L" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </header>
</template>
