import { component$, $, useSignal } from '@builder.io/qwik';
import { getTimestamp } from 'virtual:vite-info'

export default component$(() => {
  const currentTimestamp = useSignal("");

  return (
    <div>
      <p>
        Click this button to display the current time
      </p>
      <button onClick$={$(() => { currentTimestamp.value = getTimestamp(); })}>
        Click here
      </button>
      <p>
        {currentTimestamp.value}
      </p>
    </div>
  );
});
