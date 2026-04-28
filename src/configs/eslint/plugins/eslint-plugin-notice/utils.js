/**
 * Shared lib between rule and tests
 */

const _ = require("lodash"),
  fs = require("fs"),
  findRoot = require("find-root"),
  path = require("path");

const COULD_NOT_FIND = `Missing notice header`;
const REPORT_AND_SKIP = `Found a header comment which did not have a notice header, skipping fix and reporting`;
const OUTSIDE_TOLERANCE = `Found a header comment which was too different from the required notice header (similarity={{ similarity }})`;

const DEFAULT_MESSAGE_CONFIG = {
  whenFailedToMatch: COULD_NOT_FIND,
  reportAndSkip: REPORT_AND_SKIP,
  whenOutsideTolerance: OUTSIDE_TOLERANCE
};

const ESCAPE = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
const YEAR_REGEXP = /20\d{2}/;
const NON_MATCHING_HEADER_ACTIONS = ["prepend", "replace", "report"];

function escapeRegExp(str) {
  return String(str).replace(ESCAPE, "\\$&");
}

function stringifyRegexp(regexp) {
  return regexp instanceof RegExp ? regexp.source : String(regexp);
}

function regexpizeTemplate({ template, varRegexps }) {
  const allRegexpVars = Object.assign({}, { YEAR: YEAR_REGEXP }, varRegexps);
  const allPatternVars = _.mapValues(allRegexpVars, stringifyRegexp);
  return new RegExp(_.template(escapeRegExp(template))(allPatternVars));
}

function resolveTemplate({ templateFile, template, fileName }) {
  if (template) return template;
  //No template file, so move foward and disable --fix
  if (!templateFile) return null;
  //Naively look for the templateFile first
  if (fs.existsSync(templateFile)) {
    return fs.readFileSync(templateFile, "utf8");
  }
  if (!fs.existsSync(fileName)) {
    throw new Error(`Could not find the file name ${fileName}. This is necessary to find the root`);
  }
  const root = findRoot(fileName);
  const rootTemplateFile = path.join(root, templateFile);
  if (fs.existsSync(rootTemplateFile)) {
    return fs.readFileSync(rootTemplateFile, "utf8");
  }
  const absRootTemplateFile = path.resolve(rootTemplateFile);
  if (fs.existsSync(absRootTemplateFile)) {
    return fs.readFileSync(absRootTemplateFile, "utf8");
  }
  throw new Error(`Can't find templateFile @ ${absRootTemplateFile}`);
}

function resolveOptions(
  {
    mustMatch,
    templateFile,
    template,
    templateVars,
    chars,
    onNonMatchingHeader,
    varRegexps,
    nonMatchingTolerance,
    messages
  },
  fileName
) {
  onNonMatchingHeader = onNonMatchingHeader || "prepend";
  templateVars = templateVars || {};
  varRegexps = varRegexps || {};
  chars = chars || 1000;
  nonMatchingTolerance = nonMatchingTolerance || null;
  messages = Object.assign({}, DEFAULT_MESSAGE_CONFIG, messages || {});

  let mustMatchTemplate = false;
  if (!mustMatch) {
    mustMatchTemplate = true;
  } else if (!(mustMatch instanceof RegExp)) {
    mustMatch = new RegExp(mustMatch);
  }
  template = resolveTemplate({ templateFile, template, fileName });
  if(typeof template === 'string'){
    template = template.replace(/\r\n/g, "\n");
  }
  const YEAR = new Date().getFullYear();
  const allVars = Object.assign({}, { YEAR }, templateVars);
  if (mustMatchTemplate && template) {
    //create mustMatch from varRegexps and template
    mustMatch = regexpizeTemplate({ template, varRegexps });
  } else if (!template && mustMatchTemplate) {
    throw new Error("Either mustMatch, template, or templateFile must be set");
  }
  const resolvedTemplate = _.template(template)(allVars).replace(/\r\n/g, "\n");

  return { resolvedTemplate, mustMatch, chars, onNonMatchingHeader, nonMatchingTolerance, messages };
}

function createFixer({ resolvedTemplate, hasHeaderComment, topNode, onNonMatchingHeader }) {
  if (!resolvedTemplate) {
    return undefined;
  }
  if (!hasHeaderComment || (hasHeaderComment && onNonMatchingHeader === "prepend")) {
    return fixer => fixer.insertTextBeforeRange([0, 0], resolvedTemplate);
  }
  if (hasHeaderComment && onNonMatchingHeader === "replace") {
    return fixer => fixer.replaceText(topNode, resolvedTemplate);
  }
}

module.exports = { createFixer, regexpizeTemplate, COULD_NOT_FIND, REPORT_AND_SKIP, resolveOptions };
