import { component$ } from '@builder.io/qwik';
import { getBuildTime } from '~/lib/build-time';

export default component$(() => {

  return (
    <div>
      <p>
        This app was last built at: {getBuildTime()}
      </p>
    </div>
  );
});
