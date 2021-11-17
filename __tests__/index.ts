import Logger from '@simplyhexagonal/logger';

import DoorLock, {
  DoorLockPermission,
  DoorLockRestriction,
  DoorLockRole,
  DoorLockUser,
} from '../src';

import permissions from '../__fixtures__/permissions';
import restrictions from '../__fixtures__/restrictions';
import roles from '../__fixtures__/roles';
import users from '../__fixtures__/users';

const logger = new Logger({});

const fetchRolesById = async (roleIds: DoorLockRole['entityId'][]) => (await roles()).filter((r) => roleIds.includes(r.entityId));
const fetchPermissionsById = async (permissionIds: DoorLockPermission['entityId'][]) => (await permissions()).filter((p) => permissionIds.includes(p.entityId));
const fetchRestrictionsById = async (restrictionIds: DoorLockRestriction['entityId'][]) => (await restrictions()).filter((r) => restrictionIds.includes(r.entityId));
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
  logFn: (message: string) => {logger.debug('RESULT =>', message)},
});

const routeMap = {
  'GET /for-super-admin-only': async (req: any, res: any) => {
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
  'GET /for-admin-only': async (req: any, res: any) => {
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
  'POST /docs': async (req: any, res: any) => {
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
  'GET /docs': async (req: any, res: any) => {
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
  'PUT /docs': async (req: any, res: any) => {
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
  'DELETE /docs': async (req: any, res: any) => {
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

  console.log(`Testing user ${user.userId} against route: ${route}`);

  const response = {
    send: (responseMessage: string) => {
      console.log(`${route} (${user.userId}):`,responseMessage);
    },
  };

  await routeMap[route as keyof typeof routeMap](request, response);
};

const routes = Object.keys(routeMap);

describe('DoorLock', () => {
  it('works', async () => {
    await routes.reduce(async (a, route) => {
      await a;

      return users.reduce(async (a, user) => {
        await a;

        const allExpectations = [
          ...user.pathExpectations.fail,
          ...user.pathExpectations.pass,
        ];

        expect(allExpectations.sort().join()).toBe(routes.sort().join());

        return (async () => {
          const result = await performRequest(
            user,
            route,
          ).then(() => true).catch((e) => {
            // Only uncomment if all else fails
            // console.log(e);

            return false;
          });

          if (user.pathExpectations.fail.includes(route)) {
            console.log(route, 'should fail', result);
            expect(!result).toBe(true);
          } else {
            console.log(route, 'should succeed', result);
            expect(result).toBe(true);
          }
        })();
      }, Promise.resolve());
    }, Promise.resolve())
  });
});
