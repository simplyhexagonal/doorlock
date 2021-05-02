import assert from 'assert';

const pkg = require('../package.json');

import DoorLock, {
  DoorLockPermission,
  DoorLockRestriction,
  DoorLockRole,
  DoorLockUser,
} from 'doorlock';

import permissions from './mocks/permissions';
import restrictions from './mocks/restrictions';
import roles from './mocks/roles';
import users from './mocks/users';

const fetchRolesById = async (roleIds: DoorLockRole['id'][]) => (await roles()).filter((r) => roleIds.includes(r.id));
const fetchPermissionsById = async (permissionIds: DoorLockPermission['id'][]) => (await permissions()).filter((p) => permissionIds.includes(p.id));
const fetchRestrictionsById = async (restrictionIds: DoorLockRestriction['id'][]) => (await restrictions()).filter((r) => restrictionIds.includes(r.id));
const fetchRolesByHandle = async (roleHandles: DoorLockRole['handle'][]) => (await roles()).filter((r) => roleHandles.includes(r.handle));
const fetchPermissionsByHandle = async (permissionHandles: DoorLockPermission['handle'][]) => (await permissions()).filter((p) => permissionHandles.includes(p.handle));
const fetchRestrictionsByHandle = async (restrictionHandles: DoorLockRestriction['handle'][]) => (await restrictions()).filter((r) => restrictionHandles.includes(r.handle));

const doorlock = new DoorLock({
  superAdminId: 'B0O8fG',
  fetchRolesById,
  fetchPermissionsById,
  fetchRestrictionsById,
  fetchRolesByHandle,
  fetchPermissionsByHandle,
  fetchRestrictionsByHandle,
  verifyRoleExists: true,
  verifyAbilitiesExist: true,
  debug: true,
  logFn: (message: string) => console.log('RESULT =>', message),
});

assert(doorlock.version === pkg.version, 'package version mismatch');

const routeMap = {
  'GET /for-super-admin-only': async (req, res) => {
    await doorlock.evaluateAbilities(
      req.user,
      {
        roleHandles: <string[]>[],
        permissionHandles: <string[]>[],
        restrictionHandles: <string[]>[],
        resourceName: '100',
        resourceIdentifier: '101',
      },
    );

    res.send('42');
  },
  'GET /for-admin-only': async (req, res) => {
    await doorlock.evaluateAbilities(
      req.user,
      {
        roleHandles: ['admin'],
        permissionHandles: <string[]>[],
        restrictionHandles: <string[]>[],
        resourceName: '200',
        resourceIdentifier: '201',
      },
    );

    res.send('welcome to the club');
  },
  'POST /docs': async (req, res) => {
    await doorlock.evaluateAbilities(
      req.user,
      {
        roleHandles: ['admin', 'author'],
        permissionHandles: <string[]>['doc-create'],
        restrictionHandles: <string[]>[],
        resourceName: '300',
        resourceIdentifier: '301',
      },
    );

    res.send('hope you write better endings than king');
  },
  'GET /docs': async (req, res) => {
    await doorlock.evaluateAbilities(
      req.user,
      {
        roleHandles: ['admin', 'author'],
        permissionHandles: <string[]>['doc-read'],
        restrictionHandles: <string[]>[],
        resourceName: '400',
        resourceIdentifier: '401',
      },
    );

    res.send('readers lives a thousand lives before they die');
  },
  'PUT /docs': async (req, res) => {
    await doorlock.evaluateAbilities(
      req.user,
      {
        roleHandles: ['admin', 'author'],
        permissionHandles: <string[]>['doc-update'],
        restrictionHandles: <string[]>[],
        resourceName: '500',
        resourceIdentifier: '501',
      },
    );

    res.send('oh, I have that same dress');
  },
  'DELETE /docs': async (req, res) => {
    await doorlock.evaluateAbilities(
      req.user,
      {
        roleHandles: ['admin', 'author'],
        permissionHandles: <string[]>['doc-delete'],
        restrictionHandles: <string[]>['deny-doc-delete'],
        resourceName: '600',
        resourceIdentifier: '601',
      },
    );

    res.send('I am prepared to meet my maker');
  },
};

const performRequest = async (user: DoorLockUser, route: string) => {
  // let's say we have a middleware that already took the access token, fetched the user from db,
  // and injected it into the request object
  const request = {
    user,
  };

  console.log(`Testing user ${user.id} against route: ${route}`);

  const response = {
    send: (responseMessage) => {
      console.log(`${route} (${user.id}):`,responseMessage);
    },
  };

  await routeMap[route](request, response);
};

const routes = Object.keys(routeMap);

routes.forEach((route) => {
  users.forEach((user) => {
    const allExpectations = [
      ...user.pathExpectations.fail,
      ...user.pathExpectations.pass,
    ];

    assert(allExpectations.sort().join() === routes.sort().join(), `user ${user.id} is missing route expectations`);

    (async () => {
      const result = await performRequest(
        user,
        route,
      ).then(() => true).catch((e) => {
        // Only uncomment if all else fails
        // console.log(e);

        return false;
      });

      if (user.pathExpectations.fail.includes(route)) {
        assert(!result, `user ${user.id} should have been blocked for route ${route} but was allowed through`);
      } else {
        assert(result, `user ${user.id} should have been allowed through for route ${route} but was blocked`);
      }
    })();
  });
});
