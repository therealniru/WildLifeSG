// Simple Jest setup without complex mocks

// Global test utilities
global.console = {
  ...console,
  // Suppress console logs in tests unless needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
