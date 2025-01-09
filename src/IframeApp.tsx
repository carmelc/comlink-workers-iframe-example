import './App.css'
import * as Comlink from 'comlink';

function App() {
  let mainThread: { callMain: () => Promise<number> };

  window.addEventListener('message', (event) => {
    if (event.data.type === 'INIT_PORT') {
      console.log('Got init message');
      const port = event.ports[0];

      // Wrap the parent's endpoint with Comlink
      mainThread = Comlink.wrap<{callMain: () => number}>(port);

      // Expose functions to the parent
      Comlink.expose({
        async run() {
          console.log('Iframe is running');
          const mainValue = await mainThread.callMain();
          console.log('Loop is done: ', mainValue);
          return mainValue;
        }
      }, port);
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
