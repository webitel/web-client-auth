declare module '*.scss' {
	const classes: Record<string, string>;
	export default classes;
}

declare module '*.css' {
	const classes: Record<string, string>;
	export default classes;
}

declare module '*.svg?raw' {
	const content: string;
	export default content;
}

// Make this file a module so `declare module 'axios'` augments instead of replacing.
import 'axios';

declare module 'axios' {
	interface AxiosRequestConfig {
		/** Skip toast notifications for expected background failures (e.g. anonymous session check 401). */
		silent?: boolean;
	}
}
