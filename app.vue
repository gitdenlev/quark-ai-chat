<template>
  <Header />
  <main
    class="flex flex-col justify-center items-center flex-1 text-center main-center"
  >
    <h1 class="text-[40px] font-[400] mb-[10px]">Welcome to Quark.</h1>
    <p class="text-[20px] mb-[30px]">How can I help you today?</p>

    <div id="chatBox"></div>

    <div class="input__field">
      <textarea
        id="userInput"
        placeholder="What do you want to know?"
        rows="1"
      ></textarea>
      <button class="button">
        <Icon name="fluent:arrow-up-12-filled" size="20" />
      </button>
    </div>

    <div class="flex items-center justify-start gap-3 w-1/2 flex-wrap px-10">
      <QuarkBadge color="blue" iconName="tabler:language">Translate</QuarkBadge>

      <QuarkBadge color="green" iconName="majesticons:edit-pen-4-line"
        >Generation Text</QuarkBadge
      >

      <QuarkBadge color="violet" iconName="fluent:line-style-sketch-16-filled"
        >Contextual Style</QuarkBadge
      >

      <QuarkBadge color="orange" iconName="ci:code">Code</QuarkBadge>

      <QuarkBadge color="gray" iconName="pepicons-pencil:clapperboard"
        >Script Writing</QuarkBadge
      >
    </div>
  </main>
</template>

<script setup lang="ts">
const items = ref([
  {
    label: "Profile",
    icon: "i-lucide-user",
  },
  {
    label: "Billing",
    icon: "i-lucide-credit-card",
  },
  {
    label: "Settings",
    icon: "i-lucide-cog",
  },
]);
useHead({
  title: "Quark",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Quark" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/logo.svg" }],
});

const colorMode = useColorMode();
console.log(colorMode.preference);
const value = ref("");
</script>

<style scoped>
h1 {
  background: linear-gradient(90deg, #d8d8d8, #8c45ff, #d8d8d8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  animation: gradientAnimation 3s ease-in-out infinite alternate;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

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

.input__field:hover,
.input__field:focus-within {
  background-color: #444;
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
  flex-shrink: 0;
}

.button:hover {
  transform: scale(1.05);
  background-color: #9d5fff;
}

.button:active {
  transform: scale(0.95);
}

.main-center {
  width: 100%;
  max-width: 1200px; /* Або інше значення */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
