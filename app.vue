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
    <div
      class="input-section w-full flex flex-col items-center justify-between md:justify-center"
    >
      <!-- Бейджі можливостей -->
      <div v-if="!showChatBox" class="w-full max-w-4xl mx-auto mb-20 md:mb-0">
        <!-- Випадаючий список для мобільних пристроїв -->
        <div class="block md:hidden w-full px-4">
          <div class="mobile-badges-container">
            <button
              @click="toggleMobileBadges"
              class="mobile-badges-toggle"
              :class="{ 'is-active': isMobileBadgesVisible }"
            >
              <Icon
                name="i-lucide-chevron-down"
                size="20"
                class="transition-transform duration-300"
                :class="{ 'rotate-180': isMobileBadgesVisible }"
              />
            </button>

            <div
              class="mobile-badges-content"
              :class="{ visible: isMobileBadgesVisible }"
            >
              <div class="flex flex-wrap gap-3 p-4">
                <QuarkBadge
                  v-for="(badge, index) in badges"
                  :key="badge.translationKey"
                  :color="badge.color"
                  :bgColor="badge.bgColor"
                  :iconName="badge.iconName"
                  class="mobile-badge"
                  :style="{
                    animationDelay: `${index * 0.05}s`,
                    opacity: isMobileBadgesVisible ? 1 : 0,
                    transform: isMobileBadgesVisible
                      ? 'translateY(0)'
                      : 'translateY(10px)',
                  }"
                >
                  {{ t(badge.translationKey) }}
                </QuarkBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Поле введення тексту -->
      <div
        class="input__field-container fixed bottom-5 left-0 right-0 md:relative md:bottom-auto"
        :class="{ 'md:fixed md:bottom-5': showChatBox }"
      >
        <div class="input__field w-full md:w-[600px] mx-auto">
          <textarea
            class="text-md md:text-lg"
            id="userInput"
            :placeholder="t('home__placeholder')"
            rows="1"
            v-model="inputValue"
            @keydown="handleKeyDown"
            @input="autoResize"
            ref="textarea"
          ></textarea>
          <button
            class="button w-8 h-8 md:w-8 md:h-8"
            :class="{ 'button--disabled': !isActive }"
            :disabled="!isActive"
            @click="sendMessage"
            aria-label="Send message"
          >
            <Icon name="ri:apps-2-ai-line" size="25" />
          </button>
        </div>
      </div>
      <!-- Звичайне відображення для десктопу -->
      <div class="hidden md:block">
        <div
          class="flex items-center justify-center gap-5 w-full flex-wrap mt-6 xl:w-s xl:px-4 md:mx-auto"
        >
          <QuarkBadge
            v-for="badge in badges"
            :key="badge.translationKey"
            :color="badge.color"
            :bgColor="badge.bgColor"
            :iconName="badge.iconName"
          >
            {{ t(badge.translationKey) }}
          </QuarkBadge>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";
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
const isMobileBadgesVisible = ref(false);

const config = useRuntimeConfig().public;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;

const isActive = computed(() => inputValue.value.trim() !== "");

const badges = [
  {
    color: "oklch(0.488 0.243 264.376)",
    bgColor: "oklch(0.932 0.032 255.585)",
    iconName: "tabler:language",
    translationKey: "translate__badge",
  },
  {
    color: "oklch(0.491 0.27 292.581)",
    bgColor: "oklch(0.943 0.029 294.588)",
    iconName: "fluent:line-style-sketch-16-filled",
    translationKey: "contextual__badge",
  },
  {
    color: "oklch(0.527 0.154 150.069)",
    bgColor: "oklch(0.962 0.044 156.743)",
    iconName: "majesticons:edit-pen-4-line",
    translationKey: "generation__badge",
  },
  {
    color: "oklch(0.554 0.135 66.442)",
    bgColor: "oklch(0.973 0.071 103.193)",
    iconName: "mage:book",
    translationKey: "education__badge",
  },
  {
    color: "oklch(0.505 0.213 27.518)",
    bgColor: "oklch(0.936 0.032 17.717)",
    iconName: "ci:code",
    translationKey: "code__badge",
  },
  {
    color: "oklch(0.373 0.034 259.733)",
    bgColor: "oklch(0.967 0.003 264.542)",
    iconName: "mdi:clapperboard",
    translationKey: "script__badge",
  },
];

// Функція для відкриття/закриття мобільного контейнера з бейджиками
const toggleMobileBadges = () => {
  isMobileBadgesVisible.value = !isMobileBadgesVisible.value;
};

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

// Закриття мобільного контейнера з бейджиками при кліку за його межами
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    isMobileBadgesVisible.value &&
    !target.closest(".mobile-badges-container")
  ) {
    isMobileBadgesVisible.value = false;
  }
};

// Ініціалізація при монтуванні компонента
onMounted(() => {
  // Фокус на полі введення при завантаженні сторінки
  if (textarea.value) {
    textarea.value.focus();
  }

  // Додаємо обробник для закриття бейджів при кліку за межами контейнера
  document.addEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.main-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
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
  top: 80px;
  position: absolute; /* Або relative */
  max-height: calc(100vh - 80px - 100px);
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
  transition: all 0.5s ease;
  z-index: 100;
  padding: 0 10px;
}

.input__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 30px;
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
  outline: none;
  resize: none;
  border: none;
  width: calc(100% - 50px);
  padding: 8px;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
  color: #faf9f7;
}

.light-mode textarea {
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

/* Адаптивні розміри для різних екранів */
@media (min-width: 640px) {
  .button {
    min-width: 36px;
    height: 36px;
  }
}

@media (min-width: 768px) {
  .button {
    min-width: 38px;
    height: 38px;
  }
}

@media (min-width: 1024px) {
  .button {
    min-width: 42px;
    height: 42px;
  }
}

.button--disabled {
  background-color: #6666669a;
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
  word-wrap: wrap;
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

/* Новий стиль для мобільного контейнера з бейджиками */
.mobile-badges-container {
  position: fixed;
  bottom: 100px;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 90;
  padding: 0 16px;
}

.badge-button-text {
  flex-grow: 1;
  text-align: center;
}

.mobile-badges-content {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s linear;
  margin-bottom: 8px;
  opacity: 0;
  transform: translateY(10px);
}

.mobile-badges-content.visible {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0);
}

.mobile-badge {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
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

/* Оновіть медіа-запити */
@media (max-width: 768px) {
  .main-container {
    padding-bottom: 100px; /* Місце для зафіксованого поля введення */
  }
}
</style>
