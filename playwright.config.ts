import { baseConfig } from './playwright.config.base';

export default {
	...baseConfig,
	use: {
		permissions: ['clipboard-read', 'clipboard-write']
	}
};
