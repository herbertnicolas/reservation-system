const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  cucumber: {
    features: "./cypress/e2e/features",
    stepDefinitions: "./cypress/e2e/step_definitions",
  },

  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
    specPattern: "cypress/e2e/step_definitions"
  },
});