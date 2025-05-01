// frontend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Points to the setup file created below
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Handle CSS Modules (any .css file) - Needed for globals.css etc.
    '\\.(css)$': 'identity-obj-proxy',
    // Handle static assets like images, fonts
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle path aliases from tsconfig.json (e.g., @/*)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Use ts-jest for .ts and .tsx files
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Explicitly point to tsconfig
      // Enable esModuleInterop for better CJS/ESM compatibility
      diagnostics: {
         ignoreCodes: ['TS151001'] // Optional: suppress the warning itself
      },
      isolatedModules: true, // Often needed with esModuleInterop
      astTransformers: {
        before: [
          {
            path: 'ts-jest-mock-import-meta', // Handle import.meta
            options: { metaObjectReplacement: { env: { VITE_SUPABASE_URL: 'mock_url', VITE_SUPABASE_ANON_KEY: 'mock_key' } } } 
          }
        ]
      }
    }],
  },
  // Optional: Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Optional: Ignore paths for test searching/watching
  // testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  // watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
}; 