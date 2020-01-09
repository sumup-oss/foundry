import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';
import pkgUp from 'pkg-up';

import { config as prettierConfig } from '../configs/prettier/config';

export async function writeFile(
  configDir: string,
  filename: string,
  content: string,
  overwrite?: boolean
): Promise<void> {
  const formatOptions = prettierConfig();
  const fileContent = prettier.format(content, formatOptions);
  const targetDir = path.resolve(configDir);
  const filePath = path.resolve(targetDir, filename);

  if (overwrite) {
    return await fs.writeFile(filePath, fileContent);
  }

  return await fs.writeFile(filePath, fileContent, { flag: 'wx' });
}

export async function findPackageJson(): Promise<string> {
  const packagePath = await pkgUp();
  if (!packagePath) {
    throw new Error('Unable to find a "package.json" file.');
  }
  return packagePath;
}

export function addPackageScript(packageJson: any, key: string, value: string) {
  const exists = packageJson.scripts[key];
  if (exists) {
    throw new Error(`A script with the name "${key}" already exists.`);
  }
  packageJson.scripts[key] = value;
  return packageJson;
}

export async function savePackageJson(packageJson: any) {
  const packagePath = await findPackageJson();
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  return fs.writeFile(packagePath, content);
}
