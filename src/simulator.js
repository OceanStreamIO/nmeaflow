const fs = require('fs');
const path = require('path');
const netServer = require('./net-server.js');
const DEFAULT_SENSORS = require('../data/config.js');
const {createLogger} = require('./logger.js');

const readFileContent = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

const convertToAbsolutePath = (file) => {
  if (path.isAbsolute(file)) {
    return file;
  }

  return path.resolve(file);
};

const resolveLocalDataFile = (file) => {
  return path.resolve(__dirname, `../data/${file}`);
};

/**
 *
 * @param options
 * @returns {Promise<*[]>}
 */
const start = async (options = {}) => {
  const serverInstances = [];

  const { port, portStart, portEnd, file: filename, id, interval, address, config } = options;

  const logLevel = process.env.LOG_LEVEL || options.logLevel;
  const logger = createLogger({logLevel});

  let txtFilesWithDetails;

  if (filename && id && interval) {
    txtFilesWithDetails = [{ file: filename, id, interval }].map(({ file, id, interval }) => {
      return { file: convertToAbsolutePath(file), id, interval };
    });
  } else {
    let configData;
    if (config) {
      try {
        configData = require(convertToAbsolutePath(config));
      } catch (err) {
        logger.error('Failed to parse config file', err);
        process.exit(1);
      }
    }

    configData = configData || DEFAULT_SENSORS;

    txtFilesWithDetails = configData.map(({ file, id, interval }) => {
      return { file: resolveLocalDataFile(file), id, interval };
    });
  }


  let portCounter = port || portStart || 4001;
  const portEndLimit = portEnd || 4006;

  for (const { file, id, interval } of txtFilesWithDetails) {
    if (portCounter > portEndLimit) {
      logger.error('Exceeded the maximum port number');

      return;
    }

    const content = readFileContent(file);
    const server = await netServer({
      id,
      port: portCounter,
      content,
      interval,
      address
    });

    serverInstances.push(server);

    portCounter++;
  }

  return serverInstances;
};

module.exports = {
  start
};
