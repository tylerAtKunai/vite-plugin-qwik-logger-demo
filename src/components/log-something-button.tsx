import { component$, $ } from '@builder.io/qwik';
import { logSomething } from '../lib/log-something';

export default component$(() => {
  return (
    <div>
        <p>

        Click this button to log the current time to the console
        </p>
      <button onClick$={$(() => logSomething())}>
        Click here
      </button>
    </div>
  );
});
