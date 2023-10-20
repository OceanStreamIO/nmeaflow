type IntervalFunc = (arg: string) => number;

export interface SimulatorOptions {
  /**
   * The identifier for the sensor being simulated.
   */
  id: string;

  /**
   * The port number on which the simulator will listen for incoming connections.
   */
  port: number;

  /**
   * The content to be used for simulating sensor data.
   */
  content: string;

  /**
   * The interval, in milliseconds, at which the simulated data is sent. Can also be a function, will be evaluated at each run to determine the interval.
   * Optional; default value is 10000 ms.
   */
  interval?: number | IntervalFunc;

  /**
   * The address to which the server will bind. Optional; default is localhost.
   * Use '--host' or '-h' option to listen on all available IPs.
   */
  address?: string;

  /**
   * The name of the file that contains the simulation data. Optional.
   */
  filename?: string;

  /**
   * The starting port range for the simulator. Optional; will be ignored if 'port' is specified.
   */
  portStart?: number;

  /**
   * The ending port range for the simulator. Optional; will be ignored if 'port' is specified.
   */
  portEnd?: number;

  logLevel?: string;
}
