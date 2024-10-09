const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[34m[INFO] ℹ️  ${timestamp} - ${message}\x1b[0m`);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    console.error(`\x1b[31m[ERROR] ❌ ${timestamp} - ${message}\x1b[0m`);
  },
};

module.exports = logger;
