import { installDebugRecorder } from '@webitel/ui-sdk/modules/DebugRecorder';

import packageJson from '../package.json' with { type: 'json' };

installDebugRecorder({
	app: 'auth',
	version: packageJson.version,
});
