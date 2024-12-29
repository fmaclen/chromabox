import { defineConfig } from '@playwright/test';


export const baseConfig = defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	}
});
