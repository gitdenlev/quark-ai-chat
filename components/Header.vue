<script setup lang="ts">
import nuxtStorage from "nuxt-storage";
const { t } = useI18n();
const colorMode = useColorMode();
const activeMode = ref(colorMode.preference);
const { setLocale, locale } = useI18n();

const savedLocale = nuxtStorage.localStorage.getData("selectedLocale");
const selectedLocale = ref(savedLocale || locale.value);
const isModalOpen = ref(false);

if (savedLocale) {
  setLocale(savedLocale);
}

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

const changeLocale = (newLocale: string) => {
  setLocale(newLocale);
  selectedLocale.value = newLocale;

  nuxtStorage.localStorage.setData("selectedLocale", newLocale, 24, "h");

  isModalOpen.value = false;
};
</script>

<template>
  <header class="header-fixed">
    <div class="header-content">
      <div class="logo-container">
        <NuxtImg src="./logo.svg" alt="quark" width="32" />
        <h1 class="text-[32px] font-[400]">Quark</h1>
      </div>

      <UPopover
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 12,
        }"
      >
        <div
          class="settings-icon flex items-center justify-center w-10 h-10 bg-transparent p-2 hover:bg-[#e0e0e0] rounded-full transition-all duration-300 cursor-pointer"
        >
          <Icon
            name="bi:gear-wide-connected"
            size="25"
            class="settings-icon-inner"
          />
        </div>

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
              <UModal v-model:open="isModalOpen">
                <div
                  class="relative flex items-center gap-2 rounded-3xl p-2 w-full text-indigo-700"
                >
                  <Icon name="material-symbols-light:language" size="25" />

                  <span class="text-lg">{{ t("lang__btn") }}</span>
                </div>

                <template #content>
                  <div class="flex flex-col gap-3 p-4">
                    <div
                      @click="changeLocale('en')"
                      class="flex items-center justify-between text-black hover:bg-gray-100 p-2 rounded-md select-none cursor-pointer"
                      :class="{ 'active-locale': selectedLocale === 'en' }"
                    >
                      <span class="flex items-center gap-2 font-[300]"
                        >English</span
                      >
                      <span class="text-gray-700">English</span>
                    </div>

                    <div
                      @click="changeLocale('uk')"
                      class="flex items-center justify-between text-black hover:bg-gray-100 p-2 rounded-md select-none cursor-pointer"
                      :class="{ 'active-locale': selectedLocale === 'uk' }"
                    >
                      <span class="flex items-center gap-2">Українська</span>
                      <span class="text-gray-700">Ukrainian</span>
                    </div>
                  </div>
                </template>
              </UModal>
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

<style scoped>
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* backdrop-filter: blur(5px); */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.active {
  background-color: #e0e0e0;
}

.dark .active {
  background-color: #3f3f3f;
}

.active-locale {
  background-color: #e0e0e0;
}

.dark .active-locale {
  background-color: #3f3f3f;
}

.dark-mode .settings-icon:hover {
  background-color: #3f3f3f;
}
</style>
