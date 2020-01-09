export function enumToChoices(enums: { [key: string]: string }): string[] {
  return Object.values(enums);
}

type Choices = { [key: string]: any };
type Combination = { [key: string]: any };

export function getAllChoiceCombinations(options: Choices): Combination[] {
  return Object.entries(options).reduce(
    (acc, [optionName, optionValues]) => {
      const allChoiceCombinations: Combination[] = [];

      acc.forEach((combination: Combination) => {
        Object.values(optionValues).forEach((value: any) => {
          const newCombination = { ...combination, [optionName]: value };
          allChoiceCombinations.push(newCombination);
        });
      });

      return allChoiceCombinations;
    },
    [{}]
  );
}
