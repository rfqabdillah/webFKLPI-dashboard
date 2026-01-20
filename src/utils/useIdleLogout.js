import { onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { updateUser, default as apiClient } from "@/services/referensi/users";

export function useIdleLogout(timeoutMinutes = 30) {
  const router = useRouter();
  const route = useRoute();
  let timeoutId;

  const logoutUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userDataStr = localStorage.getItem("userData");
          const userData = userDataStr ? JSON.parse(userDataStr) : null;
          const userId =
            userData?.data?.[0]?.id_pengguna ||
            userData?.data?.[0]?.id ||
            userData?.id ||
            userData?.id_pengguna;

          if (userId) {
            const formData = new FormData();
            formData.append("record[status]", "Tidak Aktif");
            formData.append("_method", "PUT");
            await updateUser(userId, formData);
          }
        } catch (err) {
          console.error("Gagal update status idle logout:", err);
        }

        try {
          await apiClient.get("/logout", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (err) {
          console.warn("Logout endpoint failed or session expired:", err);
        }
      }
    } catch (error) {
      console.error("Error during idle logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      router.replace("/auth");
    }
  };

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(logoutUser, timeoutMinutes * 60 * 1000);
  };

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

  const addListeners = () => events.forEach(e => window.addEventListener(e, resetTimer));
  const removeListeners = () => events.forEach(e => window.removeEventListener(e, resetTimer));

  const startIdleDetection = () => {
    addListeners();
    resetTimer();
  };

  const stopIdleDetection = () => {
    removeListeners();
    clearTimeout(timeoutId);
  };

  onMounted(() => {
    if (route.path !== '/auth') startIdleDetection();
  });

  watch(() => route.path, (newPath) => {
    if (newPath === '/auth') {
      stopIdleDetection();
    } else {
      startIdleDetection();
    }
  });

  onUnmounted(() => stopIdleDetection());
}
