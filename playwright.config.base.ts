import { defineConfig } from '@playwright/test';

export const baseConfig = defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	use: {
		trace: 'retain-on-failure'
	},
	testDir: 'e2e',
	timeout: 5000
});
