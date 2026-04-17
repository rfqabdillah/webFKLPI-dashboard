<template>
  <div class="card profile-card h-100 mb-0">
    <div
      class="card-body d-flex flex-column align-items-center justify-content-center gap-3 p-4"
    >
      <!-- Profile Picture -->
      <div
        class="profile-avatar"
        :style="!user.foto ? { backgroundColor: avatarColor } : {}"
      >
        <img
          v-if="user.foto"
          :src="user.foto"
          alt="Profile"
          class="avatar-img"
        />
        <div v-else class="avatar-initials">
          {{ userInitials }}
        </div>
      </div>

      <!-- Profile Info -->
      <div class="profile-info text-center">
        <h5 class="mb-2 fw-bold text-dark">{{ user.nama || "Pengguna" }}</h5>
        <span class="badge badge-light-primary px-3 py-2 rounded-pill f-12">{{
          user.nama_peran || "-"
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getInitials, getRandomColor } from "@/utils/avatarUtils";

export default {
  name: "ProfileCard",
  data() {
    return {
      user: {
        nama: "",
        nama_peran: "",
        foto: null,
      },
    };
  },
  computed: {
    userInitials() {
      return getInitials(this.user.nama) || "P";
    },
    avatarColor() {
      return getRandomColor(this.user.nama);
    },
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      try {
        const rawData = localStorage.getItem("userData");
        if (rawData) {
          const parsed = JSON.parse(rawData);
          const data =
            parsed.data && Array.isArray(parsed.data) ? parsed.data[0] : parsed;

          if (data) {
            this.user.nama = data.nama || "";
            this.user.nama_peran = data.nama_peran || "";
            this.user.foto = data.foto || null;
          }
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    },
  },
};
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: white;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 4px 10px rgba(115, 102, 255, 0.2);
  border: 3px solid rgba(115, 102, 255, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-info h6 {
  font-size: 16px;
  color: #2b2b2b;
}

.f-12 {
  font-size: 12px;
}
</style>
