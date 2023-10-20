const net = require('net');
const chalk = require('chalk');

module.exports = function ({id, port, content, interval = 1000, address = 'localhost'}) {
  const logger = require('./logger.js').getLogger();
  logger.debug(`Creating simulator for ${chalk.bold(id)} on port ${chalk.bold(port)} with initial interval ${chalk.bold(interval)}`);

  let timeoutId;

  return new Promise((resolve, reject) => {
    const server = net.createServer((c) => {
      logger.debug(chalk.bgGray(' ' + id + ' '), chalk.yellow('✓') + ' client connected');

      let dynamicInterval = interval;

      const parts = content.split('\n');
      let contentLines = parts.slice(0);

      const sendLine = () => {
        let line;
        if (contentLines.length === 0) {
          contentLines = parts.slice(0);
        }

        line = contentLines.shift();
        logger.debug(chalk.bgGray(' ' + id + ' '), chalk.yellow('⇆') + ' Sending content to client:', line);
        c.write(`${line}\r\n`);

        if (typeof interval === 'function') {
          dynamicInterval = interval(id);
        }

        timeoutId = setTimeout(sendLine, dynamicInterval);
      };

      sendLine();

      c.on('end', () => {
        timeoutId && clearTimeout(timeoutId);
        logger.debug(chalk.bgGray(' ' + id + ' '), ' ✗ client disconnected');
      });

      c.pipe(c);
    });

    server.on('error', (err) => {
      logger.error(chalk.bgGray(' ' + id + ' '), 'Server error', err);
      reject(err);
    });

    server.listen(port, address, () => {
      logger.info(`${chalk.bold.bgGray(' ' + id + ' ')} Listening on address ${chalk.bold(address)}, port ${chalk.bold(port)} and initial interval ${interval}...\n`);
      resolve(server);
    });
  });
};
