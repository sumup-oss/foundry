/**
 * Shared lib between rule and tests
 */

import fs from 'node:fs';
import path from 'node:path';

import lodashTemplate from 'lodash.template';
import { readPackageUpSync } from 'read-package-up';

const COULD_NOT_FIND = `Missing notice header`;
const REPORT_AND_SKIP = `Found a header comment which did not have a notice header, skipping fix and reporting`;
const OUTSIDE_TOLERANCE = `Found a header comment which was too different from the required notice header (similarity={{ similarity }})`;

const DEFAULT_MESSAGE_CONFIG = {
  whenFailedToMatch: COULD_NOT_FIND,
  reportAndSkip: REPORT_AND_SKIP,
  whenOutsideTolerance: OUTSIDE_TOLERANCE,
};

const ESCAPE = /[-[\]/{}()*+?.\\^$|]/g;
const YEAR_REGEXP = /20\d{2}/;

function escapeRegExp(str) {
  return String(str).replace(ESCAPE, '\\$&');
}

function stringifyRegexp(regexp) {
  return regexp instanceof RegExp ? regexp.source : String(regexp);
}

function regexpizeTemplate({ template, varRegexps }) {
  const allRegexpVars = { YEAR: YEAR_REGEXP, ...varRegexps };
  const allPatternVars = Object.entries(allRegexpVars).reduce(
    (acc, [key, value]) => {
      acc[key] = stringifyRegexp(value);
      return acc;
    },
    {},
  );
  return new RegExp(lodashTemplate(escapeRegExp(template))(allPatternVars));
}

function resolveTemplate({ templateFile, template, fileName }) {
  if (template) {
    return template;
  }
  //No template file, so move foward and disable --fix
  if (!templateFile) {
    return null;
  }
  //Naively look for the templateFile first
  if (fs.existsSync(templateFile)) {
    return fs.readFileSync(templateFile, 'utf8');
  }
  if (!fs.existsSync(fileName)) {
    throw new Error(
      `Could not find the file name ${fileName}. This is necessary to find the root`,
    );
  }
  const { path: root } = readPackageUpSync(fileName);
  const rootTemplateFile = path.join(path.dirname(root), templateFile);
  if (fs.existsSync(rootTemplateFile)) {
    return fs.readFileSync(rootTemplateFile, 'utf8');
  }
  const absRootTemplateFile = path.resolve(rootTemplateFile);
  if (fs.existsSync(absRootTemplateFile)) {
    return fs.readFileSync(absRootTemplateFile, 'utf8');
  }
  throw new Error(`Can't find templateFile @ ${absRootTemplateFile}`);
}

export function resolveOptions(
  {
    mustMatch,
    templateFile,
    template,
    templateVars,
    chars,
    onNonMatchingHeader,
    varRegexps,
    nonMatchingTolerance,
    messages,
  },
  fileName,
) {
  onNonMatchingHeader = onNonMatchingHeader || 'prepend';
  templateVars = templateVars || {};
  varRegexps = varRegexps || {};
  chars = chars || 1000;
  nonMatchingTolerance = nonMatchingTolerance || null;
  messages = { ...DEFAULT_MESSAGE_CONFIG, ...(messages || {}) };

  let mustMatchTemplate = false;
  if (!mustMatch) {
    mustMatchTemplate = true;
  } else if (!(mustMatch instanceof RegExp)) {
    mustMatch = new RegExp(mustMatch);
  }
  template = resolveTemplate({ templateFile, template, fileName });
  if (typeof template === 'string') {
    template = template.replace(/\r\n/g, '\n');
  }
  const YEAR = new Date().getFullYear();
  const allVars = { YEAR, ...templateVars };
  if (mustMatchTemplate && template) {
    //create mustMatch from varRegexps and template
    mustMatch = regexpizeTemplate({ template, varRegexps });
  } else if (!template && mustMatchTemplate) {
    throw new Error('Either mustMatch, template, or templateFile must be set');
  }
  const resolvedTemplate = lodashTemplate(template)(allVars).replace(
    /\r\n/g,
    '\n',
  );

  return {
    resolvedTemplate,
    mustMatch,
    chars,
    onNonMatchingHeader,
    nonMatchingTolerance,
    messages,
  };
}

export function createFixer({
  resolvedTemplate,
  hasHeaderComment,
  topNode,
  onNonMatchingHeader,
}) {
  if (!resolvedTemplate) {
    return undefined;
  }
  if (
    !hasHeaderComment ||
    (hasHeaderComment && onNonMatchingHeader === 'prepend')
  ) {
    return (fixer) => fixer.insertTextBeforeRange([0, 0], resolvedTemplate);
  }
  if (hasHeaderComment && onNonMatchingHeader === 'replace') {
    return (fixer) => fixer.replaceText(topNode, resolvedTemplate);
  }
}
