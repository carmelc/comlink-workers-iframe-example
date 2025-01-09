import './App.css'
import { wrap, expose } from 'comlink';
import { MainApi, RemoteMainApi, Runnable } from './api-types';

function App() {
  let mainThread: RemoteMainApi;

  window.addEventListener('message', (event) => {
    if (event.data.type === 'INIT_PORT') {
      console.log('Got init message');
      const port = event.ports[0];

      mainThread = wrap<MainApi>(port);

      expose({
        async run() {
          console.log('Iframe is running');
          const mainValue = await mainThread.callMain();
          console.log('Loop is done: ', mainValue);
          return mainValue;
        }
      } as Runnable, port);
    }
  });


  return (
    <div className="card-highlight">
      <h2>IFrame</h2>
      <button onClick={() => {
        mainThread.callMain().then((result) => {
          console.log('Main thread called', result);
        });
      }}>
        Call Main
      </button>
    </div>
  )
}

export default App
