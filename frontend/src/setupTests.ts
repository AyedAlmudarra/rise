// src/setupTests.ts

// Ensure fetch is globally available for libraries like Supabase
import 'isomorphic-fetch'; // Import for side effect (polyfills global.fetch)

// Import Jest DOM matchers like .toBeInTheDocument()
// Vitest is compatible with jest-dom
import '@testing-library/jest-dom';

// Add any other global setup needed for your tests here

// Example: Clean up after each test (if using RTL)
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup();
// }); 