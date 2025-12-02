import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for react-router in Jest
import { TextDecoder, TextEncoder } from 'util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  // @ts-expect-error - Jest's types don't include TextDecoder on global
  global.TextDecoder = TextDecoder;
}

// Mock fetch globally for tests
// Individual tests can override with jest.spyOn or specific mock responses
global.fetch = jest.fn();
