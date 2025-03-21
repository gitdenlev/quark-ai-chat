export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      home__title: "Welcome to Quark.",
      home__description: "How can I help you today?",
      home__placeholder: "What do you want to know?",
      translate__badge: "Translate",
      contextual__badge: "Contextual Style",
      generation__badge: "Generation Text",
      education__badge: "Education",
      code__badge: "Code",
      script__badge: "Script Writing",
      lang__btn: "Language",
    },
    uk: {
      home__title: "Ласкаво просимо у Quark.",
      home__description: "Як я можу допомогти тобі сьогодні?",
      home__placeholder: "Що ти хочеш знати?",
      translate__badge: "Переклад",
      contextual__badge: "Контекстний стиль",
      generation__badge: "Генерація тексту",
      education__badge: "Навчання",
      code__badge: "Код",
      script__badge: "Сценарій",
      lang__btn: "Мова",
    },
  },
}));
