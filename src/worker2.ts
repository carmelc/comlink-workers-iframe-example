import { wrap, expose } from 'comlink';
import { Endpoint } from 'comlink';
import { MainApi, Runnable } from './api-types';

const exposed: Runnable = {
  async run() {
    console.log('Worker 2  is running');
    const mainThread = wrap<MainApi>(self as Endpoint);
    const mainValue = await mainThread.callMain();
    console.log('Loop 2 is done: ', mainValue);
    return mainValue;
  },
};

expose(exposed, self as Endpoint);
