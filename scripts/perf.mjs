import { spawn } from 'node:child_process';
import autocannon from 'autocannon';

const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 4000));

const result = await autocannon({
  url: 'http://127.0.0.1:4000/health',
  connections: 50,
  duration: 10,
  pipelining: 1,
});

console.log(JSON.stringify({
  requestsPerSec: result.requests.average,
  latencyP95: result.latency.p97_5,
  throughputBytesSec: result.throughput.average,
}, null, 2));

server.kill('SIGTERM');
