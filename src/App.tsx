import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import googleLabsLogo from './assets/google-labs.png';
import viteLogo from '/vite.svg'
import './App.css'
import { wrap, expose, Endpoint } from 'comlink';
import { MainApi, Runnable } from './api-types';

const exposeToRemote = (remoteName: string, endpoint: Endpoint) => expose({
  callMain() {
    console.log(`Main thread called ${remoteName}`);
    return remoteName;
  }
} as MainApi, endpoint);


function App() {
  const [callback, setCallback] = useState<() => void>(() => () => console.log('Callback not set'));
  const [callback2, setCallback2] = useState<() => void>(() => () => console.log('Callback not set'));
  const [iframeCallback, setIframeCallback] = useState<() => void>(() => () => console.log('iframe Callback not set'));
  useEffect(() => {
    console.log('Setting up workers');
    const iframe = document.getElementById('my-iframe') as HTMLIFrameElement;
    iframe.className = 'card';

    new Promise((resolve) => (iframe.onload = resolve)).then(async () => {
      const worker1 = new Worker(new URL('./worker1.ts', import.meta.url), { type: 'module' });
      const worker2 = new Worker(new URL('./worker2.ts', import.meta.url), { type: 'module' });
      // using Comlink.windowEndpoint does not allow bi-directional communication
      const channel = new MessageChannel();

      exposeToRemote('iframe', channel.port2);
      exposeToRemote('worker 1', worker1);
      exposeToRemote('worker 2', worker2);

      // init channel
      iframe.contentWindow!.postMessage({ type: 'INIT_PORT' }, '*', [channel.port1]);

      const iframeRemote = wrap<Runnable>(channel.port2);
      const remote = wrap<Runnable>(worker1);
      const remote2 = wrap<Runnable>(worker2);
      setIframeCallback(() => () => iframeRemote.run().then((result) => {
        console.log('Iframe run result', result);
      }));
      setCallback(() => () => remote.run().then((result) => {
        console.log('Remote run result', result);
      }));
      setCallback2(() => () => remote2.run().then((result) => {
        console.log('Remote run result 2', result);
      }));
    });
  }, []);


  return (
    <>
      <div>
        <a href="https://github.com/GoogleChromeLabs/comlink" target="_blank">
          <img src={googleLabsLogo} className="logo comlink" alt="Comlink logo"/>
        </a>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo"/>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo"/>
        </a>
      </div>
      <h1>Comlink + Vite + React</h1>
      <div className="card">
        <button className="action" onClick={callback}>
        Trigger Run
        </button>
        <button className="action" onClick={callback2}>
          Trigger Run 2
        </button>
        <button className="action" onClick={iframeCallback}>
          Trigger Iframe Run
        </button>
      </div>
    </>
  )
}

export default App
