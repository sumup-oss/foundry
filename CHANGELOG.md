# @sumup/foundry

## 6.0.0-next.1

### Major Changes

- [#841](https://github.com/sumup-oss/foundry/pull/841) [`286d98d`](https://github.com/sumup-oss/foundry/commit/286d98d5606b6e45efb75cf2ad41e61a974084d5) Thanks [@connor-baer](https://github.com/connor-baer)! - Changed the [package entry points](https://nodejs.org/api/packages.html#package-entry-points) to use the `exports` instead of the `main` field in the `package.json` file.

## 6.0.0-next.0

### Major Changes

- [#752](https://github.com/sumup-oss/foundry/pull/752) [`f6ef551`](https://github.com/sumup-oss/foundry/commit/f6ef551c39e27e9fd62f5f57dc140fc024b4171c) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `release` preset and the `semantic-release` config. We recommend [`changesets`](https://github.com/changesets/changesets) as a more flexible alternative.

- [#754](https://github.com/sumup-oss/foundry/pull/754) [`88be0df`](https://github.com/sumup-oss/foundry/commit/88be0dffbd7b62b40690868314ff15ef7a7d8223) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `ci` preset. Refer to the official [GitHub Actions documentation](https://docs.github.com/en/actions) to write your own workflow.
