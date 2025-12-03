import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { TransformStream, WritableStream, ReadableStream } from 'stream/web';

// Silence expected console noise from error-state tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

// Polyfill TextEncoder/TextDecoder for react-router in Jest
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  // @ts-expect-error - Jest's types don't include TextDecoder on global
  global.TextDecoder = TextDecoder;
}

if (!(global as any).TransformStream) {
  (global as any).TransformStream = TransformStream;
}

if (!(global as any).ReadableStream) {
  (global as any).ReadableStream = ReadableStream;
}

if (!(global as any).WritableStream) {
  (global as any).WritableStream = WritableStream;
}

class SafeMessagePort {
  onmessage: ((event: { data?: unknown }) => void) | null = null;
  postMessage(data?: unknown) {
    setTimeout(() => {
      this.onmessage?.({ data });
    }, 0);
  }
  close() {}
  start() {}
}

class SafeMessageChannel {
  port1: SafeMessagePort;
  port2: SafeMessagePort;

  constructor() {
    this.port1 = new SafeMessagePort();
    this.port2 = new SafeMessagePort();
    this.port2.postMessage = (data?: unknown) => {
      setTimeout(() => {
        this.port1.onmessage?.({ data });
      }, 0);
    };
    this.port1.postMessage = (data?: unknown) => {
      setTimeout(() => {
        this.port2.onmessage?.({ data });
      }, 0);
    };
  }
}

(global as any).MessageChannel = SafeMessageChannel;
(global as any).MessagePort = (global as any).MessagePort ?? SafeMessagePort;

// Prefer Node/undici fetch so MSW's node server can intercept
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fetch: nodeFetch, Headers: NodeHeaders, Request: NodeRequest, Response: NodeResponse } =
  require('undici');

(global as any).fetch = (global as any).fetch ?? nodeFetch;
(global as any).Headers = (global as any).Headers ?? NodeHeaders;
(global as any).Request = (global as any).Request ?? NodeRequest;
(global as any).Response = (global as any).Response ?? NodeResponse;

if (!(global as any).BroadcastChannel) {
  class MockBroadcastChannel {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  }
  (global as any).BroadcastChannel = MockBroadcastChannel;
}

// Lazy import server after globals are patched
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { server } = require('./server');

// MSW: start/stop per test lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});
