module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|ts)$": "babel-jest"
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth|oauth4webapi)/)',
  ],
};
