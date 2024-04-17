import { onMounted, onUnmounted } from 'vue';

export const useNextOnEnter = (callback) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
};
