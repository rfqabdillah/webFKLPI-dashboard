<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <div class="media profile-media">
      <div v-if="user.photo" class="b-r-10 profile-img-container">
        <img 
          class="b-r-10 profile-img" 
          :src="user.photo" 
          alt="Foto Profil" 
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
import apiClient from '@/services/users';

export default {
  nama: 'Profile',
  data() {
    return {
      user: {
        nama: 'Pengguna',
        nama_level: 'Role',
        photo: null, 
      },
      colors: [
        '#6c5ce7', '#00b894', '#0984e3', '#e17055', '#fdcb6e', '#d63031'
      ],
    };
  },
  computed: {
    userInitials() {
      if (!this.user.nama) return '?';
      const words = this.user.nama.trim().split(' ');
      if (words.length === 1) {
        return words[0][0].toUpperCase(); 
      } else {
        return (words[0][0] + words[1][0]).toUpperCase(); 
      }
    },
    avatarColor() {
      const index = this.user.nama
        ? this.user.nama.charCodeAt(0) % this.colors.length
        : 0;
      return this.colors[index];
    },
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) return;

    try {
      const parsedData = JSON.parse(storedUserData);
      const userProfile = parsedData.data?.[0];

      if (userProfile) {
        this.user.nama = userProfile.nama || 'Pengguna';
        this.user.nama_level = userProfile.nama_level || 'Role';
      }
    } catch (error) {
      console.error("Gagal parse user data dari localStorage:", error);
    }
  },
    async logout() {
      const result = await this.$swal.fire({
        text: "Apakah Anda yakin ingin keluar?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#efefef',
        confirmButtonColor: '#0d6efd',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Konfirmasi',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await apiClient.get('/logout', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          
        } catch (err) {
          if (err.response && err.response.status === 401) {
            console.warn('Sesi sudah berakhir di server, membersihkan data lokal');
          } else {
            console.error('Gagal menghubungi server untuk logout:', err);
          }
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          this.$router.replace('/auth');
          this.$swal.fire('Berhasil!', 'Anda telah berhasil keluar.', 'success');
        }
      }
    }
  }
};
</script>

<style scoped>
.profile-img {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
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
