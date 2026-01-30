<template>
  <div class="text-center mt-5">
    <p>Login SSO sedang diproses...</p>
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axiosEncrypt.js';
import { userLevelUmum } from "@/constants/userLevels";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  name: 'auth-sso',
  setup() {
    const toast = useToast();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    // Fungsi login SSO
    const loginWithSSO = async (ssoToken, ssoRefreshToken, access_token) => {
      try {
        console.log("Access Token:", access_token);

        // Ambil data user dari API backend
        const response = await axios.get(`/my_profil`, {
          headers: { Authorization: `Bearer ${access_token}` }
        });

        const user = response.data?.data?.user;
        if (!user) {
          toast.error("Data user tidak ditemukan.");
          router.push("/auth"); // fallback ke login
          return;
        }


        try {
          const userId = user.id_pengguna || user.id;
          if (userId) {
            const formData = new FormData();
            formData.append("record[status]", "Aktif");
            formData.append("_method", "PUT");

            // Mengirim update status ke backend
            await axios.post(`/users/${userId}`, formData, {
              headers: { Authorization: `Bearer ${access_token}` }
            });
          }
        } catch (err) {
          console.error("Gagal update status login:", err);
        }

        // Simpan token & user
        localStorage.setItem('token', access_token);
        localStorage.setItem(
            "userData",
            JSON.stringify({ data: [user] })
        );


        toast.success(`Login berhasil! Selamat datang, ${user.nama || "Pengguna"}`);

        // Redirect berdasarkan level user
        const userLevel = user.id_level ?? user.roles?.id_level;

        store.dispatch("menu/refreshMenuByUserLevel");
        router.push(userLevel === userLevelUmum ? "/my-profile" : "/");

      } catch (error) {
        console.error("Login SSO Error:", error);
        const message = error.response?.data?.message || "Login gagal. Token tidak ditemukan.";
        toast.error(message);
        router.push("/auth"); // fallback ke login
      }
    };

    // Saat mounted, ambil query params dari route
    const ssoToken = route.query.token;
    const ssoRefreshToken = route.query.refresh_token;
    const access_token = route.query.access_token;

    if (ssoToken && ssoRefreshToken && access_token) {
      loginWithSSO(ssoToken, ssoRefreshToken, access_token);
    } else {
      toast.error("Token SSO tidak ditemukan.");
      router.push("/auth"); // fallback ke login
    }

    return { loginWithSSO };
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
  margin-top: 100px;
}
</style>
