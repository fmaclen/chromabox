import { baseConfig } from './playwright.config.base';

export default {
	...baseConfig,
	webServer: {
		...baseConfig.webServer,
		env: {
			PUBLIC_IS_DEMO: 'true'
		}
	}
};
