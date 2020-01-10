import { enumToChoices } from './prompts';

describe('prompts', () => {
  describe('enumToChoices', () => {
    it('should convert an enum to an array of options', () => {
      enum Fruit {
        MANGO = 'Mango',
        BANANA = 'Banana',
        KIWI = 'Kiwi'
      }
      const actual = enumToChoices(Fruit);
      const expected = ['Mango', 'Banana', 'Kiwi'];
      expect(actual).toEqual(expected);
    });
  });
});
