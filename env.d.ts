// https://vite.dev/guide/env-and-mode#intellisense-for-typescript
/// <reference types="vite/client" />

import type { Breakpoint } from '@webitel/ui-sdk/src/plugins/breakpoint/breakpoint.plugin';

interface ImportMetaEnv {
	readonly VITE_STAGING_ENV: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$breakpoint: Breakpoint;
	}
}
