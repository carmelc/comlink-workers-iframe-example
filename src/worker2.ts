import * as Comlink from 'comlink';
import { Endpoint } from 'comlink';

const exposed = {
  async run() {
    console.log('Worker 2  is running');
    const mainThread = Comlink.wrap<{callMain: () => number}>(self as Endpoint);
    const mainValue = await mainThread.callMain();
    console.log('Loop 2 is done: ', mainValue);
    return mainValue;
  },
};

Comlink.expose(exposed, self as Endpoint);
