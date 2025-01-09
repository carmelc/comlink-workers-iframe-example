export type Runnable = { run: () => Promise<string> };
export type MainApi = { callMain: () => string };
export type RemoteMainApi = { callMain: () => Promise<string> };
