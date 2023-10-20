# NMEAFlow: Sensor Server Simulator

NMEAFlow is a basic CLI tool designed to emulate a sensor server, which can broadcast data from one or more simulated sensors at the same time. The data is read from text files and replayed continuously, at desired intervals. 

Use NMEAFlow for developing and testing applications that consume real-time sensor data, without the need for actual sensors. 

## Features

- Replay any data from text files
- Flexible port configuration
- Extensive logging and error handling
- Dynamic interval settings
- Pre-loaded with sample NMEA strings for various marine sensors
- Types included for TypeScript support
- Programmatic API for further integration

## Requirements

- Node.js >= v14.x
- NPM >= v6.x

## Installation

```bash
npm install nmeaflow
```

## Command Line Usage

### Options

| Option                  | Description                                                                                   | Default Value       |
|-------------------------|-----------------------------------------------------------------------------------------------|---------------------|
| `--port-start`| Starting port for the simulator                                                                | 4001                |
| `--port-end`    | Ending port for the simulator                                                                  | 4006                |
| `-c`, `--config`  | Config file with list of files to replay                                                       |                     |
| `--id`              | Id for an individual simulator instance                                                        |                     |
| `-p`, `--port`     | Single port to run an individual simulator instance                                            |                     |
| `-f`, `--filename`| Filename for an individual simulator instance                                                  |                     |
| `-i`, `--interval`| Broadcasting interval for an individual simulator instance in milliseconds                     | 10000               |
| `-a`, `--address` | Address to listen on                                                                           | `localhost`         |
| `-h`, `--host`            | Listen to all available IPs                                                                    |                     |
| `--log-level` | Specify log level                                                                              | `debug`             |

### Logging

You can set the log level either by running using the `--log-level` option or by setting the `LOG_LEVEL` environment variable. 

The log levels are as follows:
- `error`
- `warn`
- `info`
- `verbose`
- `debug`
- `silly`
- `none`

### Config File

The config file is a JavaScript file that exports an array of objects. Each object contains the `file`, `id`, and `interval` keys.

Example:

```js
module.exports = [
  { file: 'gps.txt', id: 'GPS', interval: 10000 },
  { file: 'trawl.txt', id: 'TRAWL_SONAR', interval: 15000 },
  { file: 'depthsounder.txt', id: 'DEPTH_SOUNDER', interval: 15000 },
  { file: 'wind.txt', id: 'WIND', interval: 10000 },
];
```

The `interval` can be either a number (in milliseconds) or a function. The function takes the `id` as argument and should return a number representing the interval in milliseconds.

### Running as an individual instance

To run the simulator as an individual instance you need to specify the individual parameters, as follows:

```bash
nmeaflow -p 4000 -f sample_data.txt -id Sensor01 --interval 10000
```

This will run the simulator with id `Sensor01` on port 4000, reading data from the file `sample_data.txt`, and broadcasting the data every 10,000 milliseconds (or 10 seconds).

## Programmatic API

NMEAFlow comes with type definitions, enabling easy integration into TypeScript projects. Here's an example:

```ts
import { NMEAFlow } from 'nmeaflow';

const options = {
  address: 'localhost',
  port: 4001,
  filename: 'custom_data.txt',
  interval: 2000,
};

const simulator = new NMEAFlow(options);
simulator.start()
  .then(() => {
    console.log('Simulator started');
  })
  .catch((err) => {
    console.error('Failed to start simulator', err);
  });
```

## License
MIT
