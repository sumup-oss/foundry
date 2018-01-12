import { dirname, resolve, join, relative } from 'path';
import { spawn } from 'child_process';
import { access, readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
const accessAsync = promisify(access);

function shouldStopRecursion(path) {
  return !/^.+node_modules/.test(path);
}

async function resolveTo(path, name) {
  if (shouldStopRecursion(path)) {
    return null;
  }

  const packageJsonPath = join(path, name);

  try {
    await accessAsync(packageJsonPath);
    return packageJsonPath;
  } catch (err) {
    const parentPath = resolve(path, '..');
    return resolveTo(parentPath, name);
  }
}

async function getPackageJsonPath(name, useRelative = false) {
  const pathMain = require.resolve(name);
  const pathPackage = await resolveTo(pathMain, 'package.json');
  return useRelative ? relative(__dirname, pathPackage) : pathPackage;
}

function isRelativePath(path) {
  const firstChar = path.split()[0];
  return firstChar === '.';
}

async function loadJson(path) {
  const isRelative = isRelativePath(path);
  if (isRelative) {
    throw new TypeError(`Relative paths are not supported: ${path}`);
  }
  try {
    const data = await readFileAsync(path);
    return JSON.parse(data);
  } catch (err) {
    return new Error(`Path does not exist. ${path}`);
  }
}

async function resolveBinaryPath(name, useRelative = false) {
  try {
    // This could potentially break, if the name of a binary (name) is different
    // from the name of the package.
    const packageJsonPath = await getPackageJsonPath(name, useRelative);
    const { bin: packageBinaries } = await loadJson(packageJsonPath);
    const binaryPath = packageBinaries[name];
    if (!binaryPath) {
      return null;
    }

    return resolve(dirname(packageJsonPath), binaryPath);
  } catch (err) {
    return null;
  }
}

function getToolArguments() {
  // The standard 2 indicating node binary, executing script, and
  // the run command and the tool argument.
  const SKIP_COUNT = 4;
  const processArgs = process.argv;
  return processArgs.slice(SKIP_COUNT);
}

async function executeBinary(path, args) {
  spawn(path, args, {
    stdio: 'inherit'
  });
}

export default async function run({ argv }) {
  const { _: commandArgs } = argv;
  const binPath = await resolveBinaryPath(commandArgs[1]);

  if (!binPath) {
    console.error(`No executable found for ${toolToRun}`);
  }

  const binArgs = getToolArguments(commandArgs);

  await executeBinary(binPath, binArgs);
}
