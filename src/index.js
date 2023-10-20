const {start} = require('./simulator.js');
const {PORT_START, PORT_END, INTERVAL_BROADCAST_MS, LOG_LEVEL} = require('./defaults.js');

module.exports = {
  NMEAFlow(options) {
    return start({
      portStart: PORT_START,
      portEnd: PORT_END,
      interval: INTERVAL_BROADCAST_MS,
      logLevel: LOG_LEVEL,
      ...options
    });
  }
};

