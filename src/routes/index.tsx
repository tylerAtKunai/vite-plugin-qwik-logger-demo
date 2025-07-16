import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import BuildTime from "~/components/build-time";
import DisplayViteInfo from "~/components/display-vite-info";
import DisplayTimeButton from "~/components/display-time-button";
import LogSomethingButton from "~/components/log-something-button";

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <BuildTime />
      <DisplayViteInfo />
      <h2>Some buttons that do stuff:</h2>
      <LogSomethingButton />
      <DisplayTimeButton />
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik Logger Plugin Demo",
  meta: [
    {
      name: "Qwik Logger Plugin Demo",
      content: "A site to demonstrate how a simple Vite plugin works with Qwiks",
    },
  ],
};
