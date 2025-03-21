<template>
  <Header />

  <main class="flex flex-col justify-center items-center flex-1 text-center main-center p-4">
    <h1 class="text-[27px] md:text-[40px] font-[400] mb-[10px]">{{ t("home__title") }}</h1>
    <p class="text-[20px] mb-[30px]">{{ t("home__description") }}</p>

    <div
      id="chatBox"
      ref="chatBox"
      class="w-full md:w-[600px] max-h-[400px] overflow-y-auto mb-5 p-3 rounded-lg"
      v-if="showChatBox"
    >
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
        {{ msg.text }}
      </div>
    </div>

    <div class="input__field w-full md:w-[600px]">
      <textarea
        id="userInput"
        :placeholder="t('home__placeholder')"
        rows="1"
        v-model="inputValue"
        @keydown="handleKeyDown"
      ></textarea>
      <button
        class="button"
        :class="{ 'button--disabled': !isActive }"
        :disabled="!isActive"
        @click="sendMessage"
      >
        <Icon name="fluent:arrow-up-12-filled" size="20" />
      </button>
    </div>

    <div class="flex items-center justify-center gap-2 w-full flex-wrap xl:justify-start xl:w-1/2 md:w-1/2 md:gap-3 md:justify-start">
      <QuarkBadge color="oklch(0.488 0.243 264.376)" bgColor="oklch(0.932 0.032 255.585)" iconName="tabler:language">
        {{ t("translate__badge") }}
      </QuarkBadge>
      <QuarkBadge color="oklch(0.491 0.27 292.581)" bgColor="oklch(0.943 0.029 294.588)" iconName="fluent:line-style-sketch-16-filled">
        {{ t("contextual__badge") }}
      </QuarkBadge>
      <QuarkBadge color="oklch(0.527 0.154 150.069)" bgColor="oklch(0.962 0.044 156.743)" iconName="majesticons:edit-pen-4-line">
        {{ t("generation__badge") }}
      </QuarkBadge>
      <QuarkBadge color="oklch(0.554 0.135 66.442)" bgColor="oklch(0.973 0.071 103.193)" iconName="mage:book">
        {{ t("education__badge") }}
      </QuarkBadge>
      <QuarkBadge color="oklch(0.505 0.213 27.518)" bgColor="oklch(0.936 0.032 17.717)" iconName="ci:code">
        {{ t("code__badge") }}
      </QuarkBadge>
      <QuarkBadge color="oklch(0.373 0.034 259.733)" bgColor="oklch(0.967 0.003 264.542)" iconName="mdi:clapperboard">
        {{ t("script__badge") }}
      </QuarkBadge>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRuntimeConfig, useHead } from "#imports";

// SEO
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
const showChatBox = ref(false);
const chatBox = ref<HTMLElement | null>(null);
const messages = ref<{ text: string; type: "user" | "bot" }[]>([]);

const config = useRuntimeConfig().public;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;

const isActive = computed(() => inputValue.value.trim() !== "");

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const sendMessage = async () => {
  const userMessage = inputValue.value.trim();
  if (!userMessage) return;

  showChatBox.value = true;
  messages.value.push({ text: userMessage, type: "user" });

  inputValue.value = "";
  messages.value.push({ text: "Thinking...", type: "bot" });

  await nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });

  fetchAIResponse(userMessage);
};

const fetchAIResponse = async (userMessage: string) => {
  const data = { contents: [{ parts: [{ text: userMessage }] }] };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    const aiResponse =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't get that.";

    messages.value[messages.value.length - 1].text = aiResponse;
  } catch (error) {
    console.error("Помилка:", error);
    messages.value[messages.value.length - 1].text = "Oops! Something went wrong. Try again later.";
  }

  await nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });
};
</script>

<style scoped>
.input__field {
  display: flex;
  align-items: center;
  max-width: 600px;
  padding: 15px;
  border-radius: 15px;
  background-color: #333;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}
.light-mode .input__field {
  background-color: #fff;
}
textarea {
  background-color: transparent;
  color: #fff;
  font-size: 18px;
  outline: none;
  resize: none;
  border: none;
  width: calc(100% - 50px);
  padding: 8px;
}
.button {
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #a65fff;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
.main-center {
  width: 100%;
  max-width: 1200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.message {
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 10px;
  max-width: 80%;
}
.message.user {
  background-color: #8c45ff;
  text-align: right;
  width: fit-content;
  border-radius: 20px;
}
.message.bot {
  background-color: #333;
  text-align: left;
  width: fit-content;
  border-radius: 20px;
}
</style>
