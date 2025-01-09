import * as Comlink from 'comlink';
import { Endpoint } from 'comlink';

const exposed = {
  async run() {
    console.log('Worker is running');
    const mainThread = Comlink.wrap<{callMain: () => number}>(self as Endpoint);
    const mainValue = await mainThread.callMain();
    console.log('Loop is done: ', mainValue);
    return mainValue;
  },
};

Comlink.expose(exposed, self as Endpoint);
