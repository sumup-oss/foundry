import { spawn } from 'child_process';

const DEFAULT_OPTIONS = {
  cwd: process.cwd(),
  detached: true,
  stdio: 'inherit'
};

function getBufferContent(chunks) {
  return Buffer.isBuffer(chunks[0])
    ? Buffer.concat(chunks).toString('utf8')
    : null;
}

export default function asyncSpawn(cmd, args, options) {
  const stdout = [];

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      ...DEFAULT_OPTIONS,
      ...options
    });

    if (child.stdout) {
      child.stdout.on('data', chunk => {
        stdout.push(chunk);
      });
    }

    child.on('close', code => {
      if (code !== 0) {
        // eslint-disable-next-line no-console
        const err = new Error(`${cmd} exited with an error (code ${code}).`);
        err.log = getBufferContent(stdout);
        reject(err);
        return;
      }

      resolve(getBufferContent(stdout));
    });

    child.on('error', err => {
      reject(err);
    });
  });
}
