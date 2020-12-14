![Typescript](https://assets.jeanlescure.io/f8mvuN.svg)
![plus](https://assets.jeanlescure.io/gxaoy.svg)
![NPM](https://assets.jeanlescure.io/iRlPH2h.svg)

# No BS Typescript Module Boilerplate

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This boilerplate focuses on keeping configuration to a minimum yet supporting all latest Typescript
features for making it as easy and worry-free as possible to get started building a performance
optimized NPM module.

This project is open to updates by its users, I ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing).

🚨 **Before continuing:**

- If you're creating a Lambda function for AWS consider looking at my [No BS Typescript Lambda Boilerplate](https://github.com/jeanlescure/no-bs-typescript-lambda-boilerplate)
- If you're creating an API using Express.js consider looking at my [No BS Typescript Server Boilerplate](https://github.com/jeanlescure/no-bs-typescript-server-boilerplate)
- If you're creating a React.js app consider looking at my [No BS React Boilerplate](https://github.com/jeanlescure/no-bs-react-boilerplate)

## Like this project? ❤️

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting me on [Patreon](https://www.patreon.com/jeanlescure) 🏆
- Starring this repo on [Github](https://github.com/jeanlescure/no-bs-typescript-boilerplate) 🌟

## How to get started using this boilerplate

The logic of this repo is structured in such a way that all you need to worry about is placing your
code in the `src` directory (using `src/index.ts` as entry point).

Take a look at the placeholder code in `src` to get familiarized with the basics.

Once you feel comfortable to start working on your own project you can run:

```sh
yarn project:new
```

The `project:new` script deletes all placeholder code and/or assets, requests you to input a new package
name, and initiates an empty git config for you to start commiting your changes to a clean slate.

## Development and build scripts

I chose Rollup to handle the transpiling, compression, and any other transformations needed to get
your Typescript code running as quickly and performant as possible.

This repo uses `runkit.js` to validate your code's sanity. Why? Because [www.npmjs.com](https://www.npmjs.com/)
uses [Runkit](https://runkit.com/home) to allow potential users to play with your module, live on
their browser, which is one of the best ways to convince someone to use your modules in their code.
Runkit will look for the `runkit.js` by default and display that as the initial playground for the
user, so by making it the default validation method during development, this encourages proper
communication with the users of your code.

**Development**

```
yarn dev
```

Uses [concurrently]() to run Rollup in watch mode (which means it will transpile to `dist` when you
save changes to your code), as well as Nodemon to listen for changes in the `dist` directory and
re-run the `runkit.js` as you modify your source! This includes running node with the `--inspect`
flag so you can inspect your code using [Google Chrome Dev Tools](https://nodejs.org/en/docs/guides/debugging-getting-started/)
(by opening `chrome://inspect` in your browser), you're welcome ;)

**Build**

```
yarn build
```

This command will build the `dist/index.js`, uglified and tree-shaken so it loads/runs faster.

## Deployment

Remember to rename your module on the `package.json`, then just folllow usual NPM conventions:

```
npm login
npm publish
```

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/jeanlescure/no-bs-typescript-boilerplate/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/jeanlescure/no-bs-typescript-boilerplate/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/jeanlescure/no-bs-typescript-boilerplate/commits?author=jeanlescure" title="Documentation">📖</a></td>
    <td align="center"><a href="https://dianalu.design"><img src="https://avatars2.githubusercontent.com/u/1036995?v=4" width="100px;" alt=""/><br /><sub><b>Diana Lescure</b></sub></a><br /><a href="https://github.com/jeanlescure/no-bs-typescript-boilerplate/commits?author=DiLescure" title="Documentation">📖</a> <a href="https://github.com/jeanlescure/no-bs-typescript-boilerplate/pulls?q=is%3Apr+reviewed-by%3ADiLescure" title="Reviewed Pull Requests">👀</a> <a href="#design-DiLescure" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
