module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/steps/**/*.ts'],
    format: ['@cucumber/pretty-formatter'],
    paths: ['tests/features/**/*.feature'],
    publishQuiet: true,
  },
};