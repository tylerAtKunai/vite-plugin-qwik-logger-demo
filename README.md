# Vite/Qwik plugin demo

This is a simple [Qwik City](https://qwik.dev/docs/) app created to demonstrate how plugins are created.

See [/src/plugins/vite-plugin-qwik-logger.ts](https://github.com/tylerAtKunai/vite-plugin-qwik-logger-demo/blob/main/src/plugins/vite-plugin-qwik-logger.ts) to view the plugin code along with comments explaining all the hooks and features.

The components in [/src/components](https://github.com/tylerAtKunai/vite-plugin-qwik-logger-demo/tree/main/src/components) can show you how the virtual module served by plugins can be used.

Run the app with `npm run dev` and then navigate to http://localhost:5173 to see the features of the plugin in action.

You can also run a production build with `npm run build` to see how some build-only hooks are utilized.