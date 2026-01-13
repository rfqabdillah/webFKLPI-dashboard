<template>
  <div class="card profile-box">
    <div class="card-body">
      <div class="media">
        <div class="media-body">
          <div class="date-badge mb-2">
            <span class="badge-custom">
              <i class="fa-solid fa-calendar text-white me-2"></i>
              {{ currentDate }}
            </span>
          </div>
          <div class="digital-clock text-white f-w-600 mb-4">
            {{ currentTime }}
          </div>
          <div class="greeting-user">
            <h4 class="f-w-600 mb-0">{{ greetingText }}, {{ userName }}!</h4>
            <p>Selamat beraktivitas!</p>
          </div>
        </div>
      </div>
      <div class="cartoon">
        <img
          class="img-fluid"
          src="@/assets/images/dashboard/cartoon.svg"
          alt="vector women with leptop"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      greetingText: "",
      userName: "Administrator",
      currentDate: "",
      currentTime: "",
    };
  },
  mounted() {
    this.updateGreeting();
    this.getUserName();
    this.updateDate();
    this.updateTime();

    this.interval = setInterval(this.updateTime, 1000);
  },
  unmounted() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    updateGreeting() {
      const h = new Date().getHours();
      if (h >= 0 && h < 11) {
        this.greetingText = "Selamat Pagi";
      } else if (h >= 11 && h < 15) {
        this.greetingText = "Selamat Siang";
      } else if (h >= 15 && h < 18) {
        this.greetingText = "Selamat Sore";
      } else {
        this.greetingText = "Selamat Malam";
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
      const date = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      this.currentDate = date.toLocaleDateString("id-ID", options);
    },
    updateTime() {
      const date = new Date();
      //format (24 hour)
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      this.currentTime = `${hours}:${minutes}`;
    },
  },
};
</script>

<style scoped>
.badge-custom {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
}

.digital-clock {
  font-size: 60px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -2px;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}
</style>
