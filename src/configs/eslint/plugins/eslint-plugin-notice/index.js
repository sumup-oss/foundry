/**
 * @fileoverview An eslint rule that checks the top of files and --fix them too!
 * @author Nick Deis
 */

import metriclcs from 'metric-lcs';

import { createFixer, resolveOptions } from './utils.js';

export default {
  meta: {
    name: 'eslint-plugin-notice',
    version: '1.0.0',
  },
  rules: {
    notice: {
      meta: {
        docs: {
          description:
            'An eslint rule that checks the top of files and --fix them too!',
          category: 'Stylistic Issues',
        },
        fixable: 'code',
        schema: false,
      },
      create(context) {
        const {
          resolvedTemplate,
          mustMatch,
          chars,
          onNonMatchingHeader,
          nonMatchingTolerance,
          messages,
        } = resolveOptions(context.options[0], context.filename);

        const { sourceCode } = context;
        const text = sourceCode.getText().substring(0, chars);
        const firstComment = sourceCode.getAllComments()[0];
        return {
          Program(node) {
            let topNode;
            let hasHeaderComment = false;
            if (!firstComment) {
              topNode = node;
            } else if (firstComment.loc.start.line <= node.loc.start.line) {
              hasHeaderComment = true;
              topNode = firstComment;
            } else {
              topNode = node;
            }
            let headerMatches = false;
            if (!headerMatches && mustMatch && text) {
              headerMatches = !!String(text)
                .replace(/\r\n/g, '\n')
                .match(mustMatch);
              //If the header matches, return early
              if (headerMatches) {
                return;
              }
            }
            //If chars doesn't match, a header comment/template exists and nonMatchingTolerance is set, try calculating string distance
            if (
              !headerMatches &&
              hasHeaderComment &&
              resolvedTemplate &&
              typeof nonMatchingTolerance === 'number'
            ) {
              const dist = metriclcs(resolvedTemplate, firstComment.value);
              //Return early, mark as true for future work if needed
              if (nonMatchingTolerance <= dist) {
                headerMatches = true;
                return;
              }
              const fix = createFixer({
                resolvedTemplate,
                hasHeaderComment,
                topNode,
                onNonMatchingHeader,
              });
              const report = {
                node,
                message: messages.whenOutsideTolerance,
                fix,
                data: { similarity: Math.round(dist * 1000) / 1000 },
              };
              context.report(report);
              return;
            }
            //report and skip
            if (
              hasHeaderComment &&
              onNonMatchingHeader === 'report' &&
              !headerMatches
            ) {
              const report = {
                node,
                message: messages.reportAndSkip,
              };
              context.report(report);
              return;
            }
            //Select fixer based off onNonMatchingHeader
            const fix = createFixer({
              resolvedTemplate,
              hasHeaderComment,
              topNode,
              onNonMatchingHeader,
            });
            if (!headerMatches) {
              const report = { node, message: messages.whenFailedToMatch, fix };
              context.report(report);
              return;
            }
          },
        };
      },
    },
  },
};
