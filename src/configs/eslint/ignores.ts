/**
 * Copyright 2025, SumUp Ltd.
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

export const ignores = {
  ignores: [
    '**/node_modules/**', // dependencies
    '**/dist/**', // generated assets
    '**/.astro/**', // generated assets (Astro)
    '**/.next/**', // generated assets (Next.js)
    '**/next-env.d.ts', // generated types (Next.js)
    '**/build/**', // generated assets (create-react-app, Remix)
    '**/storybook-static/**', // generated assets (Storybook)
    '**/public/**', // (generated) assets
    '**/vendor/**', // third-party assets
    '**/__reports__/**', // coverage reports
    '**/__coverage__/**', // coverage reports
    '**/*.snap', // snapshot files
  ],
};
