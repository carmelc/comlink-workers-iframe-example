# Vite + Comlink

This is a simple example of how to use Comlink with React.
It is showing how to create bi-directional communication between a worker/iframe and the main thread.

[Comlink docs](https://github.com/GoogleChromeLabs/comlink/blob/main/README.md) are not very clear on how to use it to communicate from the Endpoint to the main thread, so I created this example to help others.


## How to run

```bash
yarn
yarn dev
```

## How it works
There main thread creates a message channel using comlink with 2 Workers and one iFrame
Each of the buttons are invoking a method `run` on the remote endpoint, which in return is calling a method on the main thread, and return it back to the main thread.

`Main Thread` -`run`-> `Remote` -`callMain`-> `Main Thread` -`result`-> `Remote` -`result`-> `Main Thread`

Where
* `Main Thread` is the main thread [App]([./src/App.tsx]).
* `Remote` is a worker ([Worker1](./src/worker.ts) or [Worker2](./src/worker2.ts)) / [iframe](./src/IframeApp.tsx).
