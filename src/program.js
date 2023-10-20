const program = require('commander');
const chalk = require('chalk');
const { NMEAFlow } = require('./index.js');

const { PORT_START, PORT_END, LOG_LEVEL, INTERVAL_BROADCAST_MS } = require('./defaults.js');

program
  .description('Sensor server simulator which replays one or more text files at specified interval(s).')
  .option('--port-start [portStart]', `Starting port [${PORT_START}]`, `${PORT_START}`)
  .option('--port-end [portEnd]', `Ending port [${PORT_END}]`, `${PORT_END}`)
  .option('-c, --config [config]', 'Config file with list of files to replay')
  .option('--id [id]', 'Id for an individual simulator instance')
  .option('-p, --port [port]', 'Single port to run an individual simulator instance')
  .option('-f, --filename [filename]', 'Filename for an individual simulator instance')
  .option('-i, --interval [interval]', 'Broadcasting interval for an individual simulator instance', INTERVAL_BROADCAST_MS)
  .option('-a, --address [address]', 'Address to listen on [localhost]', 'localhost')
  .option('-h, --host', 'Listen to all available IPs')
  .option('--log-level [logLevel]', 'Specify log level', LOG_LEVEL)
  .helpOption('--help', 'Display help for command')
  .parse(process.argv);

const options = program.opts();
if (options.host) {
  options.address = '0.0.0.0';
}

function logError(errorMessage, infoMessage = 'Run with --help to see the complete list of options.') {
  console.error(chalk.redBright.bold('  ✖ Error:\n '), errorMessage);
  console.info(chalk.blue(`\n  ${infoMessage}\n`));
}


if (options.portStart && options.portEnd) {
  if (parseInt(options.portStart, 10) >= parseInt(options.portEnd, 10)) {
    logError('The value for --port-start should be smaller than --port-end.');
    process.exit(1);
  }
} else if (options.portStart && !options.portEnd || !options.portStart && options.portEnd) {
  logError('Both --port-start and --port-end must be supplied.');
  process.exit(1);
}

if (options.port) {
  if (!(options.id && options.interval && options.filename)) {
    logError('When specifying --port for an individual instance, you must also specify --id and --filename.');
    process.exit(1);
  }
}

NMEAFlow(options).catch((err) => {
  console.error('Simulator failed to start', err);
  process.exit(1);
});
