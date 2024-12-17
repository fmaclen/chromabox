import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: process.env.PUBLIC_ADAPTER === 'cloudflare' ? adapterStatic() : adapterCloudflare(),
		version: {
			name: process.env.npm_package_version
		},
		alias: {
			$i18n: 'src/i18n'
		}
	}
};

export default config;
