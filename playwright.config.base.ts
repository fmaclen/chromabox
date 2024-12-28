import { defineConfig } from '@playwright/test';

export const baseConfig = defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	workers: process.env.CI ? 1 : undefined,
	retries: process.env.CI ? 2 : 0,
	use: {
		viewport: { width: 1366, height: 900 },
		trace: 'retain-on-failure'
	},
	testDir: 'e2e',
	timeout: 5000
});
