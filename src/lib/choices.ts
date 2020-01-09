import { isArray } from 'lodash/fp';

export function enumToChoices(enums: { [key: string]: string }): string[] {
  return Object.values(enums);
}

type Choices = { [key: string]: any };

export function getAllChoiceCombinations(possibleChoices: Choices): Choices[] {
  return Object.entries(possibleChoices).reduce(
    (acc, [optionName, choices]) => {
      const isMultiple = isArray(choices);
      const choiceEnum = isMultiple ? choices[0] : choices;
      const choicesForOption = Object.values(choiceEnum);
      const allCombinations: Choices[] = [];

      acc.forEach((combination: Choices) => {
        choicesForOption.forEach((value: any) => {
          const choice = isMultiple ? [value] : value;
          allCombinations.push({
            ...combination,
            [optionName]: choice
          });
        });
      });

      return allCombinations;
    },
    [{}]
  );
}
