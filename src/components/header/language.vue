<template>
  <li class="language-nav">
    <div
      class="lang-btn"
      @click="toggleLanguage"
      :title="currentLang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'"
    >
      <div class="flag-box">
        <img
          v-if="currentLang === 'id'"
          src="https://flagcdn.com/id.svg"
          alt="Indonesia"
          class="flag-img"
        />
        <img
          v-else
          src="https://flagcdn.com/gb.svg"
          alt="English"
          class="flag-img"
        />
      </div>
      <span class="lang-text">{{ currentLang === "id" ? "ID" : "EN" }}</span>
    </div>
  </li>
</template>

<script>
import { mapGetters } from "vuex";
import { localeOptions } from "../../constants/config";

export default {
  name: "languagePage",
  data() {
    return {
      localOptions: localeOptions,
    };
  },
  computed: {
    ...mapGetters({
      langIcon: "langIcon",
      langLangauge: "langLangauge",
    }),
    currentLang() {
      return this.$i18n.locale || "id";
    },
    currentIcon() {
      return this.currentLang === "id" ? "flag-icon-id" : "flag-icon-us";
    },
  },
  methods: {
    toggleLanguage() {
      const newLang =
        this.currentLang === "id"
          ? { id: "en", name: "English", icon: "flag-icon-us", short: "(EN)" }
          : {
              id: "id",
              name: "Indonesia",
              icon: "flag-icon-id",
              short: "(ID)",
            };

      this.$i18n.locale = newLang.id;
      this.$store.dispatch("setLang", newLang);
    },
  },
  mounted() {
    const savedLang = localStorage.getItem("currentLanguage") || "id";
    const savedIcon =
      localStorage.getItem("currentLanguageIcon") || "flag-icon-id";
    this.$store.dispatch("setLang", {
      id: savedLang,
      icon: savedIcon,
    });
    this.$i18n.locale = savedLang;
  },
};
</script>

<style scoped>
.language-nav {
  display: flex;
  align-items: center;
  list-style: none;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-btn:hover .flag-box {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.flag-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.flag-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lang-text {
  font-weight: 700;
  font-size: 14px;
  color: #374151;
  letter-spacing: 0.5px;
}

.lang-btn:hover .lang-text {
  color: #15406a;
}
</style>
