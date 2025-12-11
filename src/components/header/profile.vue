<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <div class="media profile-media">
      <div v-if="user.photo" class="b-r-10 profile-img-container">
        <img
          class="b-r-10 profile-img"
          :src="user.photo"
          alt="Foto Profil"
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
      <li>
        <vue-feather type="user"></vue-feather>
        <span>Account</span>
      </li>
      <li @click="logout" style="cursor: pointer">
        <vue-feather type="log-in"></vue-feather>
        <span>Log out</span>
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
      user: {
        nama: "Pengguna",
        nama_level: "Role",
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
      if (!storedUserData) return;

      try {
        const parsedData = JSON.parse(storedUserData);
        const userProfile = parsedData.data?.[0];

        if (userProfile) {
          // Only update if data actually changed (to avoid unnecessary re-renders)
          if (this.user.nama !== userProfile.nama) {
            this.user.nama = userProfile.nama || "Pengguna";
          }
          if (this.user.nama_level !== userProfile.nama_level) {
            this.user.nama_level = userProfile.nama_level || "Role";
          }
          if (this.user.photo !== userProfile.foto) {
            this.user.photo = userProfile.foto || null;
          }
        }
      } catch (error) {
        console.error("Gagal parse user data dari localStorage:", error);
      }
    },

    async logout() {
      const result = await this.$swal.fire({
        text: "Apakah Anda yakin ingin keluar?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#efefef",
        confirmButtonColor: "#0d6efd",
        cancelButtonText: "Batal",
        confirmButtonText: "Konfirmasi",
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
            "Berhasil!",
            "Anda telah berhasil keluar.",
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
</style>
