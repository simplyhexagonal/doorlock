![DoorLock.js logo featuring a door lock with a fingerprint and abstract blueish shapes](https://assets.jeanlescure.io/doorlock-js-logo.svg)

# DoorLock.js

![tests](https://github.com/jeanlescure/doorlock/workflows/tests/badge.svg) [![try on runkit](https://badge.runkitcdn.com/doorlock.svg)](https://npm.runkit.com/doorlock)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A zero-dependency package to do the heavy-lifting (in back-end APIs) of allowing or denying access
based on a hierarchy of restrictions, permissions, roles, and users.

The main goal is to make implementing role-based access (with permission overrides) in your code as
easy as the following example:

```js
// The following promise will either return true or throw an 'Unauthorized' error
doorlock.evaluateAbilities(
  // a user object (previously fetched by your code) to be evaluated against
  // roles, permissions, and restrictions (a.k.a. "abilities")
  user,
  // options defining the "abilities" the user will be challenged against
  {
    // a group of users that share the 'author' role will be allowed access
    roleHandles: ['author'],
    // any single user with the 'doc-create' permission will be allowed access
    // (regardless of whether they have the 'author' role or not)
    permissionHandles: ['doc-create'],
    // any single user with the 'deny-doc-create' restriction will be blocked and bounced-back
    // (even if they have the 'author' role or the 'doc-create' permission)
    restrictionHandles: ['deny-doc-create'],
  },
).then(
  () => {
    next();
  }
).catch(
  (err) => {
    res.status(401);
    res.render('error', { error: err });
  }
);
```

([Click here to see an example on RunKit](https://npm.runkit.com/doorlock) that you can try out right now!)

## Before you continue

- If you are also looking to implement login using Google, Facebook, Github, and/or implement your own custom SSO, take a look at [Session SSO](https://github.com/jeanlescure/session-sso)
- If you'd like to build Typescript packages like this one, check out the [No BS Typescript Boilerplate](https://github.com/jeanlescure/no-bs-typescript-boilerplate)

## Like this project? ❤️

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting me on [Patreon](https://www.patreon.com/jeanlescure) 🏆
- Starring this repo on [Github](https://github.com/jeanlescure/doorlock) 🌟

## Basics

In order to better understand how to properly use DoorLock, its good to understand
the basic entity definitions and assumptions driving the logic.

Firstly, these are the basic entity definitions that detail access hierarchy:

- Permissions allow functionality to run
- Restrictions block functionality from running
- A Super Admin is a hard-coded user which has **all** permissions and **no** restrictions
- A set of permissions and restrictions are called abilities
- Roles have abilities
- Users have roles
- Users can also have abilities which override the user's role(s) abilities
- Roles and abilities have handles which are used to let doorlock know when a user is allowed to trigger specific functionality

From the previous, the following is assumed in regards to your user and access related data:

```ts
// Permissions will be stored with a structure containing at least the following properties:
{
  id: string,
  name: string,
  handle: string,
  description: string
}

// Restrictions will be stored with a structure containing at least the following properties:
{
  id: string,
  name: string,
  handle: string,
  description: string
}

// Roles will be stored with a structure containing at least the following properties:
{
  id: string,
  name: string,
  handle: string,
  description: string,
  abilities: {
    permissions: Permission[],
    restrictions: Restriction[]
  }
}

// User will be stored with a structure containing at least the following properties:
{
  id: string,
  roles: Role[],
  abilities: {
    permissions: Permission[],
    restrictions: Restriction[],
  }
}
```

Finally, the following rule definitions dictate precedence, from top to bottom, where top-most rules
trump any rules below them:

- User restrictions
- ⬇
- User permissions
- ⬇
- User roles (when a user has two "conflicting" roles [i.e. one role restricts what the other permits], role restrictions will be respected above role permissions)
- ⬇
- Role restrictions
- ⬇
- Role permissions

## What about Groups and Organizations?

This project is meant to be self-contained, small, and easy to maintain. When you take a look at the
source code you will see that much of the code is reutilized amongst DoorLock entities (restrictions,
permissions, roles, and users).

Experience dictates that the logic behind groups and organizations will vary widely between projects.

For example, just wonder if you will want a group comprised of users from two or more organizations,
a cross-organizational group if you may. That right there would be a text-book example of the [law of diminishing returns](https://en.wikipedia.org/wiki/Diminishing_returns),
where the effort to implement said use-case would be disproportionately higher to the benefit provided
to a smaller percentage of the devs using DoorLock.

If your project is large enough to include groups and organizations as part of the access-management
requirements, more than likely your team will have sufficient members to create this higher order of
access hierarchy without much hassle. Specially taking into consideration that you'd already have
DoorLock ready to throw as the cherry on top of your API cake 😉

## How to get started using this package

Import DoorLock as you would any other package:

```ts
import DoorLock from 'doorlock';
```

DoorLock needs to be able to fetch roles, permissions, and restrictions (i.e. from your app's DB),
thus anywhere on your code **before** your API's server start, define the following functions:

```ts
const fetchRolesById = async (roleIds) => /* your custom logic */;
const fetchPermissionsById = async (permissionIds) => /* your custom logic */;
const fetchRestrictionsById = async (restrictionIds) => /* your custom logic */;
const fetchRolesByHandle = async (roleHandles) => /* your custom logic */;
const fetchPermissionsByHandle = async (permissionHandles) => /* your custom logic */;
const fetchRestrictionsByHandle = async (restrictionHandles) => /* your custom logic */;
```

Also before starting the server, and more importantly, before defining any routes you wish to control
access to, instantiate DoorLock with the following options (which include the aforementione fetch functions):

```ts
const doorlock = new DoorLock({
  superAdminId: '...', // must be accessible from the user object as: user.id
  fetchRolesById,
  fetchPermissionsById,
  fetchRestrictionsById,
  fetchRolesByHandle,
  fetchPermissionsByHandle,
  fetchRestrictionsByHandle,
  // The following are optional
  verifyRoleExists: true, // defaults to: false (to save on performance)
  verifyAbilitiesExist: true, // defaults to: false (to save on performance)
  debug: true, // defaults to: false
  logFn: (message: string) => console.log('MY CUSTOM LOG =>', message), // only works if debug: true
});
```

**NOTE:** The `verifyRoleExists` and `verifyAbilitiesExist` options should be turned on solely to debug
errors or inconsistencies that you may suspect to be caused by "ghost" roles or abilities left behind
after deletion of the original entity (i.e. a user has a role id of a role that was deleted).

Once instantiated you can implement DoorLock on each request, as in the following example:

```ts
server.post('/doc', (req, res) => {
  const user = /* i.e. the user object returned after validating the access token on req.headers */;

  doorlock.evaluateAbilities(
    user,
    {
      roleHandles: ['author'], // <== Only allows access to users with the author role
      permissionHandles: [],
      restrictionHandles: [],
    },
  ).then(() => {
    res.status(200);
    res.send(`User ${userId} is allowed to create documents`);
  }).catch(() => {
    res.status(401);
    res.render('error', {error: `User ${userId} is NOT allowed to create documents`});
  });
});
```

Or better yet, create access specific middlewares:

```ts
// Middleware that only allows users/roles with the 'doc-manipulation' permission
const docManipulationAccessControl = (req, res, next) => {
  const user = /* i.e. the user object returned after validating the access token on req.headers */;

  return doorlock.evaluateAbilities(
    user,
    {
      roleHandles: [],
      permissionHandles: ['doc-manipulation'],
      restrictionHandles: [],
    },
  ).then(() => {
    next();
  }).catch(() => {
    res.status(401);
    res.send('Unauthorized');
  });
}

// Then the access logic becomes trivial to re-use and maintain
server.post('/doc', docManipulationAccessControl, (req, res) => { /* ... */ });
server.get('/doc', docManipulationAccessControl, (req, res) => { /* ... */ });
server.put('/doc', docManipulationAccessControl, (req, res) => { /* ... */ });
server.delete('/doc', docManipulationAccessControl, (req, res) => { /* ... */ });

```

If you would like a functioning example, you're welcome to try [this dummy server with DoorLock example on Runkit](https://npm.runkit.com/doorlock).

And if you'd like a more thorough example take a look at the mock and test files under the `specs`
directory on this repository.

## Troubleshooting

- If a user that's supposed to be given access keeps being blocked, there may be an error produced by
missing data or properties that is being suppressed by the `catch` logic. In these cases simply try and
refactor the catch logic to log the error (i.e. `.catch((e) => console.log(e))`) to get more details
to debug with, although it would be advisable that you refactor the catch clause to verify the error
and alert you of any error other than `Unauthorized`.

## Development and build scripts

Rollup was chosen to handle the transpiling, compression, and any other transformations needed to get
Typescript code running as quickly and performant as possible.

**Development**

```sh
yarn dev
```

Uses [concurrently]() to run Rollup in watch mode (which means it will transpile to `dist` when you
save changes to your code), as well as Nodemon to listen for changes in the `dist` directory and
re-run the tests in the `specs` directory as you modify the source!

This includes running node with the `--inspect` flag so you can inspect your code using [Google Chrome Dev Tools](https://nodejs.org/en/docs/guides/debugging-getting-started/)
(by opening `chrome://inspect` in your browser), you're welcome ;)

**Build**

```sh
yarn build
```

This command will build the `dist/index.js`, uglified and tree-shaken so it loads/runs faster.

## Contributing

Yes, thank you! Projects like this thrive when they are community-driven.

Please update the docs and tests and add your name to the package.json file on any PR you submit.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/jeanlescure/doorlock/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/jeanlescure/doorlock/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/jeanlescure/doorlock/commits?author=jeanlescure" title="Documentation">📖</a></td>
    <td align="center"><a href="https://dianalu.design"><img src="https://avatars2.githubusercontent.com/u/1036995?v=4" width="100px;" alt=""/><br /><sub><b>Diana Lescure</b></sub></a><br /><a href="https://github.com/jeanlescure/doorlock/commits?author=DiLescure" title="Documentation">📖</a> <a href="https://github.com/jeanlescure/doorlock/pulls?q=is%3Apr+reviewed-by%3ADiLescure" title="Reviewed Pull Requests">👀</a> <a href="#design-DiLescure" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Copyright (c) 2020-2021 [DoorLock Contributors](https://github.com/jeanlescure/doorlock/#contributors-).<br/>
Licensed under the Apache License 2.0.
