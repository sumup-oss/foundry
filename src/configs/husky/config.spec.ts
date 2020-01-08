import { config } from './config';

describe('husky', () => {
  describe('with options', () => {
    it('should return a config', () => {
      const actual = config();
      expect(actual).toMatchInlineSnapshot(`
              Object {
                "hooks": Object {
                  "pre-commit": "foundry run lint-staged",
                },
              }
          `);
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        hooks: {
          'pre-commit': 'custom command'
        }
      };
      const actual = config(options, overrides);
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "hooks": Object {
            "pre-commit": "custom command",
          },
        }
      `);
    });
  });
});
