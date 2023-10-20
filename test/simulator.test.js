const assert = require('assert').strict;
const net = require('net');
const {start: startSimulator} = require('../src/simulator.js'); // Replace with the actual path

function createClient(port) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ port }, () => {
      resolve(client);
    });

    client.on('error', reject);
  });
}


describe('Simulator Interval Testing', function() {

  it('test receive data at a fixed interval', function(done) {
    startSimulator({ interval: 100, file: 'test/data/sample_data.txt', id: 'test' }).then((serverInstances) => {
      return createClient(4001).then((testClient) => {
        const expectedInterval = 100;
        let startTime;
        let lines = [];
        let times = 0;

        testClient.once('data', (data) => {
          startTime = Date.now();
        });

        testClient.on('data', (data) => {
          lines.push(data.toString());

          times += 1;

          if (times === 2) {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;

            let error;
            try {
              assert.ok(elapsed >= expectedInterval);
              assert.ok(lines[0].includes('sample_data,1,2,3'));
              assert.ok(lines[1].includes('sample_data,4,5,6'), 'Second line does not match: ' + lines[1]);
            } catch (err) {
              error = err;
            } finally {
              testClient.end();
              serverInstances[0].close(function() {
                done(error);
              });
            }
          }
        });
      });
    });
  });

  it('create default server instances', function(done) {
    startSimulator().then((serverInstances) => {

      return createClient(4002).then((testClient) => {
        let lines = [];

        testClient.once('data', (data) => {
          lines.push(data.toString());
          let error;
          try {
            assert.strictEqual(serverInstances.length, 4);
            assert.ok(lines[0].startsWith('$IMDBS,167.235,f,50.973,M,27.872,F*16'));
          } catch (err) {
            error = err;
          } finally {
            testClient.end();
            for (let server of serverInstances) {
              server.close();
            }
            done(error);
          }
        });
      });
    });
  });

  it('should receive data at a dynamic interval', function(done) {
    const dynamicInterval = (() => {
      let counter = 1;

      return (id) => {
        return counter++ * 100;
      };
    })();

    startSimulator({
      port: 4004,
      interval: dynamicInterval,
      file: 'test/data/sample_data.txt',
      id: 'dynamicTest'
    }).then((serverInstances) => {
      return createClient(4004).then((testClient) => {
        let startTime;
        let lines = [];
        let times = 0;
        const expectedInterval = 300;

        testClient.once('data', (data) => {
          startTime = Date.now();
        });

        testClient.on('data', (data) => {
          lines.push(data.toString());

          times += 1;

          if (times >= 3) {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;

            let error;
            try {
              assert.ok(elapsed >= expectedInterval, `Elapsed time ${elapsed} should be >= ${expectedInterval}`);
              assert.ok(lines[0].includes('sample_data,1,2,3'));
              assert.ok(lines[1].includes('sample_data,4,5,6'), 'Second line does not match: ' + lines[1]);
              assert.ok(lines[2].includes('sample_data,1,2,3'), 'Third line does not match: ' + lines[2]);
            } catch (err) {
              error = err;
            } finally {
              testClient.end();
              serverInstances[0].close(function () {
                done(error);
              });
            }
          }
        });
      });
    });
  });
});
