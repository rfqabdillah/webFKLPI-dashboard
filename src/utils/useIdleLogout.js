import { onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useIdleLogout(timeoutMinutes = 15) {
  const router = useRouter();
  const route = useRoute();
  let timeoutId;

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    router.replace('/auth');
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
