module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  transform: {},
  testEnvironment: 'jest-environment-node',
  //testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts', '.service', '.service.ts'],
  transformIgnorePatterns: ["node_modules/(?!angular/.*)"],

  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules', 'angular'],
};

//command to execute jest: node --experimental-vm-modules node_modules/.bin/jest
