<template>
  <Header />

  <main
    class="flex flex-col justify-center items-center flex-1 text-center main-container p-4 transition-all duration-500"
    :class="{ 'chat-active': showChatBox }"
  >
    <!-- Заголовок та опис - зникають при активному чаті -->
    <h1
      class="text-[27px] md:text-[40px] font-[400] mb-[10px] transition-opacity duration-500"
      :class="{ 'opacity-0': showChatBox }"
    >
      {{ t("home__title") }}
    </h1>
    <p
      class="text-[20px] mb-[30px] transition-opacity duration-500"
      :class="{ 'opacity-0': showChatBox }"
    >
      {{ t("home__description") }}
    </p>

    <!-- Чат-контейнер з повідомленнями -->
    <div
      id="chatBox"
      ref="chatBox"
      class="w-full md:w-[600px] max-h-[65vh] chat-container transition-all duration-500"
      :class="{ 'chat-visible': showChatBox, 'chat-hidden': !showChatBox }"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-wrapper"
        :style="{ animationDelay: `${index * 0.12}s` }"
      >
        <div :class="['message', msg.type]">
          <div class="message-content">
            <img
              v-if="msg.type === 'bot'"
              src="/logo.svg"
              alt="AI Logo"
              class="ai-logo"
            />
            <span class="text-xl message-text">{{ msg.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Інтерактивна частина (поле вводу + бейджі) -->
    <div class="input-section w-full flex flex-col items-center justify-center">
      <!-- Поле введення тексту -->
      <div
        class="input__field-container"
        :class="{ 'fixed-input': showChatBox }"
      >
        <div class="input__field w-full md:w-[600px]">
          <textarea
            id="userInput"
            :placeholder="t('home__placeholder')"
            rows="1"
            v-model="inputValue"
            @keydown="handleKeyDown"
            @input="autoResize"
            ref="textarea"
          ></textarea>
          <button
            class="button"
            :class="{ 'button--disabled': !isActive }"
            :disabled="!isActive"
            @click="sendMessage"
            aria-label="Send message"
          >
            <Icon name="fluent:arrow-up-12-filled" size="20" />
          </button>
        </div>
      </div>

      <!-- Бейджі можливостей (показуються тільки в неактивному режимі) -->
      <div
        class="badges-container transition-all duration-500 mt-6"
        v-if="!showChatBox"
      >
        <div
          class="flex items-center justify-center gap-3 w-full flex-wrap md:gap-4"
        >
          <QuarkBadge
            color="oklch(0.488 0.243 264.376)"
            bgColor="oklch(0.932 0.032 255.585)"
            iconName="tabler:language"
          >
            {{ t("translate__badge") }}
          </QuarkBadge>
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
          >
            {{ t("code__badge") }}
          </QuarkBadge>
          <QuarkBadge
            color="oklch(0.373 0.034 259.733)"
            bgColor="oklch(0.967 0.003 264.542)"
            iconName="mdi:clapperboard"
          >
            {{ t("script__badge") }}
          </QuarkBadge>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRuntimeConfig, useHead } from "#imports";

// SEO
useHead({
  title: "Quark",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content: "Quark AI - Intelligent conversation assistant",
    },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/logo.svg" }],
});

const { t } = useI18n();
const inputValue = ref("");
const showChatBox = ref(false);
const chatBox = ref<HTMLElement | null>(null);
const textarea = ref<HTMLTextAreaElement | null>(null);
const messages = ref<{ text: string; type: "user" | "bot" }[]>([]);

const config = useRuntimeConfig().public;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;

const isActive = computed(() => inputValue.value.trim() !== "");

// Автоматичне підлаштування висоти текстового поля
const autoResize = () => {
  if (!textarea.value) return;

  textarea.value.style.height = "auto";
  const newHeight = Math.min(textarea.value.scrollHeight, 120); // Обмеження максимальної висоти
  textarea.value.style.height = `${newHeight}px`;
};

// Обробка клавіші Enter для відправки повідомлення
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Відправка повідомлення
const sendMessage = async () => {
  const userMessage = inputValue.value.trim();
  if (!userMessage) return;

  showChatBox.value = true;
  messages.value.push({ text: userMessage, type: "user" });

  inputValue.value = "";
  if (textarea.value) {
    textarea.value.style.height = "auto"; // Скидаємо висоту після відправки
  }

  messages.value.push({
    text: t("ai__think"),
    type: "bot",
  });

  await nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });

  fetchAIResponse(userMessage);
};

// Запит до API для отримання відповіді
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
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn't get that.";

    messages.value[messages.value.length - 1].text = aiResponse;
  } catch (error) {
    console.error("Помилка:", error);
    messages.value[messages.value.length - 1].text =
      "Oops! Something went wrong. Try again later.";
  }

  await nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });
};

// Ініціалізація при монтуванні компонента
onMounted(() => {
  // Фокус на полі введення при завантаженні сторінки
  if (textarea.value) {
    textarea.value.focus();
  }
});
</script>

<style scoped>
.main-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  transition: all 0.5s ease;
  position: relative;
}

.chat-active {
  padding-bottom: 100px;
}

.input-section {
  position: relative;
  z-index: 20;
  margin-top: 20px;
  width: 100%;
}

.chat-container {
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  overflow-y: auto;
  scrollbar-width: thin;
  position: relative;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.chat-visible {
  display: block;
  opacity: 1;
  transform: translateY(0);
  animation: slideIn 0.5s forwards;
  position: fixed;
  top: 80px;
}

.chat-hidden {
  display: none;
  opacity: 0;
  transform: translateY(20px);
}

.input__field-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  transition: all 0.5s ease;
  z-index: 100;
}

.fixed-input {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  animation: slideUp 0.5s forwards;
}

.input__field {
  display: flex;
  align-items: center;
  max-width: 600px;
  padding: 12px 15px;
  border-radius: 15px;
  background-color: rgba(51, 51, 51, 0.85);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  border: 2px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input__field:focus-within {
  border-color: rgba(166, 95, 255, 0.6);
  box-shadow: 0 4px 16px rgba(166, 95, 255, 0.15);
}

.light-mode .input__field:focus-within {
  border-color: rgba(166, 95, 255, 0.6);
  box-shadow: 0 4px 16px rgba(166, 95, 255, 0.15);
}

.light-mode .input__field {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
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
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
  color: #ffffff8c;
}

textarea::placeholder {
  color: #ffffff8c;
}

.light-mode textarea::placeholder {
  color: #1919198c;
}

.light-mode textarea {
  color: #191919;
}


.button {
  min-width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #a65fff;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.button--disabled {
  background-color: #666;
  cursor: auto;
  transform: none;
}

.message-wrapper {
  display: flex;
  margin: 12px 0;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

.message {
  display: inline-block;
  max-width: 85%;
}

.message.user {
  margin-left: auto;
  color: #faf9f7;
}

.message.bot {
  margin-right: auto;
}

.message-content {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 18px;
  word-break: break-word;
}

.message-text {
  line-height: 1.5;
  text-align: left;
}

.user .message-content {
  background-color: #8c45ff;
  border-top-right-radius: 4px;
  justify-content: flex-end;
}

.bot .message-content {
  background-color: rgba(51, 51, 51, 0.7);
  backdrop-filter: blur(5px);
  border-top-left-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.light-mode .bot .message-content {
  background-color: rgba(240, 240, 240, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.ai-logo {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}

.badges-container {
  margin-top: 24px;
  width: 100%;
  max-width: 700px;
}

/* Анімації */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Додаткові стилі для форматування повідомлень */
.message ul {
  padding-left: 20px;
  list-style-type: disc;
}

.message ol {
  padding-left: 20px;
  list-style-type: decimal;
}

.message strong {
  font-weight: bold;
}

.message em {
  font-style: italic;
}

.message code {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 4px;
  border-radius: 4px;
}

/* Адаптивні стилі для мобільних пристроїв */
@media (max-width: 640px) {
  .chat-container {
    top: 70px;
    max-height: 60vh;
  }

  .fixed-input {
    bottom: 10px;
  }

  .message {
    max-width: 90%;
  }
}
</style>
