import { Plugin } from 'vite';

/**
 * A Vite plugin for Qwik projects.
 *
 * Features:
 * - Resolves a virtual module 'virtual:vite-info' with runtime and build-time timestamps
 * - Appends a timestamp to transformed JS/TS files for debugging
 * - Logs file changes to the terminal during dev mode
 * - Adds some custom logging during the build process
 * @returns 
 */
export default function qwikLogger(): Plugin {
	const virtualModuleId = "virtual:vite-info";

	// The resolved ID starts with '\0' to mark it as virtual and avoid filesystem conflicts.
	// Without it, vite might think that there is a file named 'virtual:vite-info'.
	const resolvedVirtualModuleId = "\0" + virtualModuleId;

	// Whenever this file is changed, the dev server will be restarted and buildTime will
	// be recalculated.
	const buildTime = new Date().toISOString();

	const pluginName = "vite-plugin-qwik-logger";

	let isDev = false;
	let pluginNames: string[] = [];
	let viteMode: string = "";
	let viteCommand: string = "";
	let viteConfigRoot: string = "";

	return {
		name: pluginName,

		// Run the plugin before other plugins
		// Other options are 'default' or 'post'.
		// see https://vite.dev/guide/api-plugin.html#plugin-ordering
		enforce: "pre",

		/**
		 * Only run the plugin on the dev server.
		 * The other option is 'build' to run the plugin only during production builds.
		 * Note that if you are using virtual modules like we are in this plugin,
		 * you will receive errors if you attempt to create a production build 
		 * i.e. running `npm run build`. If serving virtual modules, a better way of only 
		 * executing hooks on the dev server is to utilize a variable like `isDev` in this 
		 * plugin and then setting it in the config hook (see below). Then use this variable
		 * to short circuit hooks you do not wish to execute in production. 
		 * See https://vite.dev/guide/api-plugin.html#conditional-application
		*/
		// apply: 'serve',

		/**
		 * Vite hook that runs once during plugin setup.
		 * Captures the current command ('serve' or 'build') so we can restrict behavior to dev mode only.
		 * https://vite.dev/guide/api-plugin.html#config
		 * @param _ 
		 * @param param1 
		 */
		config(_, { command }) {
			isDev = command === "serve";
		},

		/**
		 * Intercepts import requests and resolves the virtual module ID.
		 * If the source matches 'virtual:vite-info', return a special resolved ID.
		 * The resolved ID starts with '\0' to mark it as internal and avoid filesystem conflicts.
		 * https://rollupjs.org/plugin-development/#resolveid
		 * @param source 
		 * @returns 
		 */
		resolveId(source) {
			// Uncomment to only resolve this in a dev server.
			// This may not be desired as you could run into production build
			// errors with virual modules.
			//if (!isDev) return null;

			if (source === virtualModuleId) {
				return resolvedVirtualModuleId;
			}

			return null;
		},

		/**
		 * Multiple plugins can contain the same hooks. If that is the case, 
		 * we can specify which order the hooks are executed in.
		 * In this example, we specify resolveId as an object rather than a function.
		 * The order property tells which order to run this hook in. The options are
		 * 'pre' to run first, 'post' to run last, or 'default' to be executed somewhere 
		 * in the middle. If multiple plugins have the same hook defined with the same 
		 * order, they will be executed in the order the plugins are presented in 
		 * vite.config.ts. Then we can define a handler that executes when resolveId is 
		 * called.
		 */
		// resolveId: {
		// 	order: 'pre',
		// 	handler(source){

		// 		// Uncomment to only resolve this in a dev server.
		// 		// This may not be desired as you could run into production build
		// 		// errors with virual modules.
		// 		// if(!isDev) return null;

		// 		if (source === virtualModuleId)
		// 		{
		// 			return resolvedVirtualModuleId;
		// 		}

		// 		return null;
		// 	}
		// },

		/**
		 * Provides the actual content of the virtual module.
		 * If the requested ID matches our resolved virtual module, return dynamically generated code.
		 * This exports both a runtime timestamp function and a build-time constant.
		 * https://rollupjs.org/plugin-development/#load
		 * @param id 
		 * @returns 
		 */
		load(id) {
			// Uncomment to only load this virtual module in a dev server.
			// This may not be desired as you could run into production build
			// errors with virual modules.
			//if (!isDev) return null;

			if (id === resolvedVirtualModuleId) {
				const pluginsString = pluginNames.map(p => "'" + p + "'").join(",");

				return `
					export const getTimestamp = () => new Date().toISOString();
					export const buildTime = "${buildTime}";
					export const pluginNames = [${pluginsString}];
					export const viteMode = "${viteMode}";
					export const viteCommand = "${viteCommand}";
					export const viteConfigRoot = "${viteConfigRoot}";
        		`
			}

			return null;
		},

		/**
		 * Transforms regular .js or .ts files during development.
		 * Appends a timestamp comment to the bottom of the file.
		 * This is useful for debugging HMR updates and caching behavior.
		 * https://rollupjs.org/plugin-development/#transform
		 * @param code 
		 * @param id 
		 * @returns 
		 */
		transform(code, id) {
			if (!isDev) return null;

			if (/\.(js|ts)$/.test(id)) {
				const timestamp = new Date().toISOString();

				return `${code}\n// Last updated: ${timestamp}`;
			}

			return null;
		},

		/**
		 * Responds to file system changes during development (create, update, delete).
		 * Logs the event type and file path to the terminal, along with a timestamp.
		 * https://rollupjs.org/plugin-development/#watchchange 
		 * @param id 
		 * @param change 
		 * @returns 
		 */
		watchChange(id, change) {
			if (!isDev) return;

			const timestamp = new Date().toISOString();

			console.log(`[${timestamp}] File ${change.event}: ${id}`);
		},

		// ADDITIONAL HOOKS

		/**
		 * Runs after the config hook but before building or starting the dev server.
		 * This could be useful for exposing user defined settings in the config.
		 * https://vite.dev/guide/api-plugin.html#configresolved
		 * @param config 
		 */
		configResolved(config) {
			pluginNames = config.plugins.map(p => p.name);
			viteMode = config.mode;
			viteCommand = config.command;
			viteConfigRoot = config.root;
		},
		/**
		 * Called once when the dev server or build process starts.
		 * Could be useful for logging or warmup tasks.
		 * https://rollupjs.org/plugin-development/#buildstart
		 */
		buildStart() {
			console.log(`\n[${pluginName}] Building...`);
		},

		/**
		 * buildEnd is not actually executed in the dev server but will
		 * be executed in a production build.
		 * https://rollupjs.org/plugin-development/#buildend
		 */
		buildEnd() {
			console.log(`\n[${pluginName}] Done building`);
		},

		/**
		 * Only runs during the build process - not in the dev server.
		 * This can be used to output bundle/file information or inject metadata
		 * into packaged files. Here we output all the files in the bundle to the terminal
		 * (which is redundant since Qwik already displays this).
		 * https://rollupjs.org/plugin-development/#generatebundle
		 * @param _ 
		 * @param bundle 
		 */
		generateBundle(_, bundle) {
			console.log(`\n[${pluginName}] Output bundle contains:`);
			for (const fileName in bundle) {
				console.log(` - ${fileName}`);
			}
		},

		/**
		 * Runs at the very end of the build process - not in the dev server.
		 * This is the very last lifecycle hook to run. 
		 * This could be used to send notifications or webhooks or trigger deployment 
		 * steps after the build.
		 * https://rollupjs.org/plugin-development/#closebundle
		 */
		closeBundle(){
			console.log(`\n[${pluginName}] Build is complete. Goodbye!\n`)
		},


		/**
		 * Called during Hot Module Replacement (HMR).
		 * Lets you customize how modules update in the browser.
		 * This could be used to warn a developer that an undesirable change was made
		 * e.g. a generated file was updated.
		 * You could also do something like trigger a full page reload with `server.ws.send({ type: 'full-reload' });`
		 * You could also use `server.ws.send` to send custom events to the client for custom HMR handling.
		 * https://vite.dev/guide/api-plugin.html#handlehotupdate
		 */
		handleHotUpdate({ file }) {
			console.log(`[HMR] Reloading due to file change: ${file}`);

			// You could do something like trigger a full page reload here
			// note that you must include `server` above in the input parameters like
			// handleHotUpdate({ file, server }) {}
			// server.ws.send({ type: 'full-reload' });
		},
	};
}
