/**
 * Copyright 2019, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import crossSpawn from 'cross-spawn';

type StdioBaseOption = 'pipe' | 'inherit' | 'ignore';
type StdioOption = StdioBaseOption | StdioBaseOption[];

interface SpawnOptions {
  cwd?: string;
  detached?: boolean;
  stdio?: StdioOption;
}

const DEFAULT_OPTIONS: SpawnOptions = {
  cwd: process.cwd(),
  detached: true,
  stdio: 'inherit',
};

function getBufferContent(chunks: Uint8Array[]): string {
  return Buffer.concat(chunks).toString('utf8');
}

export function spawn(
  cmd: string,
  args: string[],
  options: SpawnOptions,
): Promise<string> {
  const stdout: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    const child = crossSpawn(process.execPath, [cmd, ...args], {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    if (child.stdout) {
      child.stdout.on('data', (chunk: Uint8Array) => {
        stdout.push(chunk);
      });
    }

    child.on('close', (code) => {
      if (code !== 0) {
        const err = new Error(
          `${cmd} exited with an error (code ${
            code ? code.toString() : 'unknown'
          }).`,
        );
        reject(err);
        return;
      }

      resolve(getBufferContent(stdout));
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}
