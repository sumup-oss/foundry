export function enumToChoices(enums: { [key: string]: string }): string[] {
  return Object.values(enums);
}

type Choices = { [key: string]: any };

export function getAllChoiceCombinations(possibleChoices: Choices): Choices[] {
  return Object.entries(possibleChoices).reduce(
    (acc, [optionName, choiceEnum]) => {
      const choicesForOption = Object.values(choiceEnum);
      const allCombinations: Choices[] = [];

      acc.forEach((combination: Choices) => {
        choicesForOption.forEach((choice: any) => {
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
