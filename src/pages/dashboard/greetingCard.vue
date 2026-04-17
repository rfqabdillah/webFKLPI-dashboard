<template>
  <div class="greeting-card h-100 mb-0">
    <div class="greeting-bg" />
    <div class="greeting-content">
      <!-- Left: Text content -->
      <div class="greeting-left">
        <div class="greeting-top">
          <span class="date-pill">
            <i class="fa-regular fa-calendar-days"></i>
            {{ currentDate }}
          </span>
        </div>

        <div class="clock-section">
          <span class="clock-time">{{ currentTime }}</span>
        </div>

        <div class="greeting-bottom">
          <p class="greeting-text">{{ greetingText }},</p>
          <h2 class="greeting-name">{{ userName }}</h2>
          <p class="greeting-sub">Semoga harimu menyenangkan</p>
        </div>
      </div>

      <!-- Right: Large emoji with slide transition -->
      <div class="greeting-emoji">
        <transition name="emoji-slide" mode="out-in">
          <span class="emoji-icon" :key="timeEmoji">{{ timeEmoji }}</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GreetingCard",
  data() {
    return {
      interval: null,
      greetingInterval: null,
      greetingText: "",
      userName: "",
      currentDate: "",
      currentTime: "",
      timeEmoji: "☀️",
    };
  },
  mounted() {
    this.updateGreeting();
    this.getUserName();
    this.updateDate();
    this.updateTime();
    this.interval = setInterval(this.updateTime, 1000);
    this.greetingInterval = setInterval(() => {
      this.updateGreeting();
      this.getUserName();
    }, 60000);
  },
  unmounted() {
    if (this.interval) clearInterval(this.interval);
    if (this.greetingInterval) clearInterval(this.greetingInterval);
  },
  methods: {
    updateGreeting() {
      const h = new Date().getHours();
      if (h >= 5 && h < 11) {
        this.greetingText = "Selamat Pagi";
        this.timeEmoji = "🌅";
      } else if (h >= 11 && h < 15) {
        this.greetingText = "Selamat Siang";
        this.timeEmoji = "☀️";
      } else if (h >= 15 && h < 18) {
        this.greetingText = "Selamat Sore";
        this.timeEmoji = "🌇";
      } else {
        this.greetingText = "Selamat Malam";
        this.timeEmoji = "🌙";
      }
    },
    getUserName() {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData && parsedData.data && parsedData.data.length > 0) {
            const fullName = parsedData.data[0].nama || "Administrator";
            this.userName = fullName.split(" ")[0];
          }
        }
      } catch (e) {
        console.error("Error retrieving user name from localStorage:", e);
      }
    },
    updateDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      this.currentDate = new Date().toLocaleDateString("id-ID", options);
    },
    updateTime() {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>

<style scoped>
.greeting-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 240px;
}

.greeting-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--theme-deafult, #7366ff) 0%,
    #6c5ce7 50%,
    var(--theme-deafult, #7366ff) 100%
  );
  z-index: 0;
}

.greeting-content {
  position: relative;
  z-index: 1;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 240px;
}

.greeting-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 184px;
  flex: 1;
}

.greeting-top {
  display: flex;
  align-items: center;
}

.date-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.clock-section {
  margin: 12px 0;
}

.clock-time {
  font-size: 56px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -2px;
  font-variant-numeric: tabular-nums;
}

.greeting-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 24px;
}

.emoji-icon {
  font-size: 100px;
  line-height: 1;
  opacity: 0.85;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
  animation: emojiFloat 3s ease-in-out infinite;
  user-select: none;
  display: inline-block;
}

@keyframes emojiFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.03);
  }
}

.emoji-slide-enter-active,
.emoji-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.emoji-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.emoji-slide-enter-to {
  opacity: 0.85;
  transform: translateY(0) scale(1);
}

.emoji-slide-leave-from {
  opacity: 0.85;
  transform: translateY(0) scale(1);
}

.emoji-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
}

/* Greeting bottom */
.greeting-bottom {
  margin-top: 4px;
}

.greeting-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2px;
  font-weight: 400;
}

.greeting-name {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 1.2;
}

.greeting-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .greeting-content {
    padding: 20px;
    min-height: 200px;
  }
  .clock-time {
    font-size: 40px;
  }
  .emoji-icon {
    font-size: 64px;
  }
  .greeting-name {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .emoji-icon {
    font-size: 48px;
  }
  .greeting-emoji {
    margin-left: 12px;
  }
}
</style>
