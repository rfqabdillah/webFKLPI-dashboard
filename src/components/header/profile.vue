<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="media profile-media">
      <div class="profile-skeleton-avatar shimmer"></div>
      <div class="media-body">
        <div
          class="profile-skeleton-text shimmer"
          style="width: 80px; height: 14px"
        ></div>
        <div
          class="profile-skeleton-text shimmer mt-1"
          style="width: 60px; height: 12px"
        ></div>
      </div>
    </div>

    <!-- Loaded State -->
    <div v-else class="media profile-media">
      <div v-if="user.photo" class="b-r-10 profile-img-container">
        <img
          class="b-r-10 profile-img"
          :src="user.photo"
          :alt="$t('Profile Photo')"
          @error="handleImageError"
        />
      </div>

      <div
        v-else
        class="profile-initial"
        :style="{ backgroundColor: avatarColor }"
      >
        {{ userInitials }}
      </div>

      <div class="media-body">
        <span>{{ user.nama }}</span>
        <p class="mb-0 font-roboto">
          {{ user.nama_level }} <i class="middle fa fa-angle-down"></i>
        </p>
      </div>
    </div>

    <ul class="profile-dropdown onhover-show-div">
      <li @click="logout" style="cursor: pointer">
        <vue-feather type="log-in"></vue-feather>
        <span>{{ $t("Logout") }}</span>
      </li>
    </ul>
  </li>
</template>

<script>
import apiClient from "@/services/users";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";

export default {
  name: "Profile",
  data() {
    return {
      isLoading: true,
      user: {
        nama: this.$t("User"),
        nama_level: this.$t("Role"),
        photo: null,
      },
      userDataCheckInterval: null,
    };
  },
  computed: {
    userInitials() {
      return getInitials(this.user.nama);
    },
    avatarColor() {
      return getRandomColor(this.user.nama);
    },
  },
  mounted() {
    this.loadUserData();

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", this.handleStorageChange);

    // Listen for custom event when user updates profile in same tab
    window.addEventListener("userDataUpdated", this.handleUserDataUpdate);

    // Fallback: Check for userData changes periodically (in case events don't fire)
    this.userDataCheckInterval = setInterval(() => {
      this.loadUserData();
    }, 3000); // Check every 3 seconds
  },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener("storage", this.handleStorageChange);
    window.removeEventListener("userDataUpdated", this.handleUserDataUpdate);

    // Clear interval
    if (this.userDataCheckInterval) {
      clearInterval(this.userDataCheckInterval);
    }
  },
  methods: {
    goToAccount() {
      this.$router.push("/account");
    },

    handleImageError() {
      this.user.photo = null;
    },

    handleStorageChange(e) {
      // Triggered when localStorage changes in another tab/window
      if (e.key === "userData") {
        this.loadUserData();
      }
    },

    handleUserDataUpdate() {
      // Triggered by custom event when user updates profile
      this.loadUserData();
    },

    loadUserData() {
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        // Small delay so skeleton is visible
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
        return;
      }

      try {
        const parsedData = JSON.parse(storedUserData);
        const userProfile = parsedData.data?.[0];

        if (userProfile) {
          // Only update if data actually changed (to avoid unnecessary re-renders)
          if (this.user.nama !== userProfile.nama) {
            this.user.nama = userProfile.nama || this.$t("User");
          }
          if (this.user.nama_level !== userProfile.nama_level) {
            this.user.nama_level = userProfile.nama_level || this.$t("Role");
          }
          if (this.user.photo !== userProfile.foto) {
            this.user.photo = userProfile.foto || null;
          }
        }
      } catch (error) {
        console.error("Gagal parse user data dari localStorage:", error);
      } finally {
        // Small delay so skeleton is visible
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      }
    },

    async logout() {
      const result = await this.$swal.fire({
        text: this.$t("Are you sure you want to logout?"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#efefef",
        confirmButtonColor: "#0d6efd",
        cancelButtonText: this.$t("Cancel"),
        confirmButtonText: this.$t("Confirm"),
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            await apiClient.get("/logout", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
        } catch (err) {
          if (err.response && err.response.status === 401) {
            console.warn(
              "Sesi sudah berakhir di server, membersihkan data lokal"
            );
          } else {
            console.error("Gagal menghubungi server untuk logout:", err);
          }
        } finally {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");

          this.$router.replace("/auth");
          this.$swal.fire(
            this.$t("Success"),
            this.$t("You have successfully logged out"),
            "success"
          );
        }
      }
    },
  },
};
</script>

<style scoped>
.profile-img-container {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 50%;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-initial {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
}

.profile-media {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Skeleton Loader */
.profile-skeleton-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.profile-skeleton-text {
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.shimmer {
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
