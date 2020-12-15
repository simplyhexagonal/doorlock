# DoorLock.js

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
    res.status(500);
    res.render('error', { error: err });
  }
);
```

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

```ts
// TODO: Document usage
```

## Development and build scripts

Rollup was chosen to handle the transpiling, compression, and any other transformations needed to get
Typescript code running as quickly and performant as possible.

**Development**

```
yarn dev
```

Uses [concurrently]() to run Rollup in watch mode (which means it will transpile to `dist` when you
save changes to your code), as well as Nodemon to listen for changes in the `dist` directory and
re-run the tests in the `specs` directory as you modify the source!

This includes running node with the `--inspect` flag so you can inspect your code using [Google Chrome Dev Tools](https://nodejs.org/en/docs/guides/debugging-getting-started/)
(by opening `chrome://inspect` in your browser), you're welcome ;)

**Build**

```
yarn build
```

This command will build the `dist/index.js`, uglified and tree-shaken so it loads/runs faster.

## Contributing

Yes, thank you! Projects like this thrive when they are community-driven.

Please update the docs and tests and add your name to the package.json file on any PR you submit.
