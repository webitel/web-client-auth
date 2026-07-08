import { onMounted, onUnmounted } from 'vue';

export const useNextOnEnter = (callback: () => void) => {
	const handleKeyDown = (e: KeyboardEvent) => {
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
