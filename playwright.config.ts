import { baseConfig } from './playwright.config.base';
import { VIEWPORT_SIZE } from './src/lib';

export default {
	...baseConfig,
	use: {
		permissions: ['clipboard-read', 'clipboard-write'],
		viewport: VIEWPORT_SIZE,
		trace: 'retain-on-failure'
	},
	workers: process.env.CI ? 1 : undefined,
	retries: process.env.CI ? 2 : 0,
	testDir: 'e2e',
	timeout: 5000,
	expect: {
		toMatchSnapshot: {
			maxDiffPixels: 900
		}
	}
};
