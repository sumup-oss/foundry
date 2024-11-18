/**
 * Copyright 2020, SumUp Ltd.
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

import { isArray } from './type-check.js';

type Enum = { [key: string]: string };
type Choices = { [key: string]: Enum | Enum[] };
type Combination = { [key: string]: string | string[] };

export function getAllChoiceCombinations(
  possibleChoices: Choices,
): Combination[] {
  return Object.entries(possibleChoices).reduce(
    (acc, [optionName, choices]) => {
      const choiceEnum = isArray(choices) ? choices[0] : choices;
      const choicesForOption = Object.values(choiceEnum);
      const allCombinations: Combination[] = [];

      acc.forEach((combination: Combination) => {
        choicesForOption.forEach((value) => {
          const choice = isArray(choices) ? [value] : value;
          allCombinations.push({
            ...combination,
            [optionName]: choice,
          });
        });
      });

      return allCombinations;
    },
    [{}],
  );
}
