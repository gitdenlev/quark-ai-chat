<template>
  <Header />
  <main
    class="flex flex-col justify-center items-center flex-1 text-center main-center"
  >
    <h1 class="text-[40px] font-[400] mb-[10px]">{{ t("home__title") }}</h1>
    <p class="text-[20px] mb-[30px]">{{ t("home__description") }}</p>

    <div id="chatBox"></div>

    <div class="input__field">
      <textarea
        id="userInput"
        :placeholder="t('home__placeholder')"
        rows="1"
        v-model="inputValue"
      ></textarea>
      <button
        class="button"
        :class="{ 'button--disabled': !isActive }"
        :disabled="!isActive"
      >
        <Icon name="fluent:arrow-up-12-filled" size="20" />
      </button>
    </div>

    <div class="flex items-center justify-start gap-3 w-1/2 flex-wrap px-10">
      <QuarkBadge
        color="oklch(0.488 0.243 264.376)"
        bgColor="oklch(0.932 0.032 255.585)"
        iconName="tabler:language"
        >{{ t("translate__badge") }}</QuarkBadge
      >

      <QuarkBadge
        color="oklch(0.491 0.27 292.581)"
        bgColor="oklch(0.943 0.029 294.588)"
        iconName="fluent:line-style-sketch-16-filled"
      >
        {{ t("contextual__badge") }}
      </QuarkBadge>

      <QuarkBadge
        color="oklch(0.527 0.154 150.069)"
        bgColor="oklch(0.962 0.044 156.743)"
        iconName="majesticons:edit-pen-4-line"
      >
        {{ t("generation__badge") }}
      </QuarkBadge>

      <QuarkBadge
        color="oklch(0.554 0.135 66.442)"
        bgColor="oklch(0.973 0.071 103.193)"
        iconName="mage:book"
      >
        {{ t("education__badge") }}
      </QuarkBadge>

      <QuarkBadge
        color="oklch(0.505 0.213 27.518)"
        bgColor="oklch(0.936 0.032 17.717)"
        iconName="ci:code"
        >{{ t("code__badge") }}</QuarkBadge
      >
      <QuarkBadge
        color="oklch(0.373 0.034 259.733)"
        bgColor="oklch(0.967 0.003 264.542)"
        iconName="mdi:clapperboard"
      >
        {{ t("script__badge") }}
      </QuarkBadge>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: "Quark",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Quark" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/logo.svg" }],
});

const { t } = useI18n();

const inputValue = ref("");

const isActive = computed(() => inputValue.value.trim() !== "");
</script>

<style scoped>
.input__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  max-width: 600px;
  padding: 15px;
  border-radius: 15px;
  background-color: #333;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin-bottom: 20px;
}

.light-mode .input__field {
  background-color: #fff;
}

.input__field:hover,
.input__field:focus-within {
  background-color: #444;
  color: #faf9f7;
}

.light-mode .input__field:hover,
.light-mode .input__field:focus-within {
  background-color: white;
}

/* Исправленная textarea */
textarea {
  background-color: transparent;
  color: #fff;
  font-size: 18px;
  outline: none;
  resize: none;
  border: none;
  width: calc(100% - 50px);
  max-height: 120px;
  overflow: hidden;
  line-height: 1.4;
  padding: 8px;
}

.light-mode textarea {
  color: #191919;
  background-color: transparent;
}

.light-mode textarea::placeholder {
  color: #19191950;
}

/* Исправленная кнопка */
.button {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  border-radius: 50%;
  background: #8c45ff;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.main-center {
  width: 100%;
  max-width: 1200px; /* Або інше значення */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.button--disabled {
  background-color: gray;
  cursor: auto;
}
</style>
