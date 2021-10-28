import {
  DoorLockEntity,
  DoorLockOptions,
  DoorLockPermission,
  DoorLockRestriction,
  DoorLockRole,
  DoorLockUser,
} from './interfaces';

export * from './interfaces';

// @ts-ignore
import { version } from '../package.json';

interface DoorLockLogOptions {
  logFn: DoorLockOptions['logFn'];
  userId: string;
  wasAllowed: boolean;
  resourceName?: string;
  resourceIdentifier?: string;
  reason: string;
}

interface DoorLockEvaluationOptions {
  roleHandles: DoorLockRole['handle'][];
  permissionHandles: DoorLockPermission['handle'][];
  restrictionHandles: DoorLockRestriction['handle'][];
  resourceName?: string;
  resourceIdentifier?: string;
}

class DoorLock {
  static version = version;

  superAdminId: string;
  fetchRolesById: DoorLockOptions['fetchRolesById'];
  fetchPermissionsById: DoorLockOptions['fetchPermissionsById'];
  fetchRestrictionsById: DoorLockOptions['fetchRestrictionsById'];
  fetchRolesByHandle: DoorLockOptions['fetchRolesByHandle'];
  fetchPermissionsByHandle: DoorLockOptions['fetchPermissionsByHandle'];
  fetchRestrictionsByHandle: DoorLockOptions['fetchPermissionsByHandle'];
  verifyRoleExists: boolean = false;
  verifyAbilitiesExist: boolean = false;
  debug: boolean = false;
  logFn: DoorLockOptions['logFn'];

  constructor({
    superAdminId,
    fetchRolesById,
    fetchPermissionsById,
    fetchRestrictionsById,
    fetchRolesByHandle,
    fetchPermissionsByHandle,
    fetchRestrictionsByHandle,
    verifyRoleExists,
    verifyAbilitiesExist,
    debug,
    logFn = console.log,
  }: DoorLockOptions) {
    this.superAdminId = superAdminId;
    this.fetchRolesById = fetchRolesById;
    this.fetchPermissionsById = fetchPermissionsById;
    this.fetchRestrictionsById = fetchRestrictionsById;
    this.fetchRolesByHandle = fetchRolesByHandle;
    this.fetchPermissionsByHandle = fetchPermissionsByHandle;
    this.fetchRestrictionsByHandle = fetchRestrictionsByHandle;
    this.verifyRoleExists = verifyRoleExists || this.verifyRoleExists;
    this.verifyAbilitiesExist = verifyAbilitiesExist || this.verifyAbilitiesExist;
    this.debug = Boolean(debug);
    this.logFn = logFn;

    console.log(`DoorLock initiated with options:`, {
      superAdminId: this.superAdminId,
      fetchRolesById: this.fetchRolesById,
      fetchPermissionsById: this.fetchPermissionsById,
      fetchRestrictionsById: this.fetchRestrictionsById,
      fetchRolesByHandle: this.fetchRolesByHandle,
      fetchPermissionsByHandle: this.fetchPermissionsByHandle,
      fetchRestrictionsByHandle: this.fetchRestrictionsByHandle,
      verifyRoleExists: this.verifyRoleExists,
      verifyAbilitiesExist: this.verifyAbilitiesExist,
      debug: this.debug,
      logFn: logFn,
    });
  }

  checkSuperAdmin = ({id}: DoorLockUser): boolean => {
    if (this.superAdminId && id === this.superAdminId) {
      return true;
    }

    return false;
  };

  logAbilityEvaluation = ({
    logFn,
    userId,
    wasAllowed,
    resourceName,
    resourceIdentifier,
    reason,
  }: DoorLockLogOptions): void => {
    if (this.debug) {
      let message = `user ${userId} was ${wasAllowed ? 'allowed' : 'not allowed'} access`;
      message += (
        resourceName || resourceIdentifier
      ) ? (
        ` to ${resourceName ? `${resourceName}`: ''} ${resourceIdentifier ? `${resourceIdentifier}`: ''}`
      ) : (
        ''
      );
      message += (reason) ? ` due to: ${reason}` : '';

      logFn(message);
    }
  };

  verifyEntityExistence = async <T extends DoorLockEntity>({
    userId,
    entityHandles,
    entityIds,
    entityName,
    resourceName,
    resourceIdentifier,
    fetchByIdsFn,
    fetchByHandlesFn,
  }: {
    userId: DoorLockUser['id'];
    entityIds: DoorLockEntity['id'][];
    entityHandles: DoorLockEntity['handle'][];
    entityName: string;
    resourceName?: string;
    resourceIdentifier?: string;
    fetchByIdsFn: (entityIds: DoorLockEntity['id'][]) => Promise<T[]>;
    fetchByHandlesFn: (entityHandles: DoorLockEntity['handle'][]) => Promise<T[]>;
  }): Promise<{userEntities: T[]; appEntities: T[];}> => {
    const existingEntities: DoorLockEntity[] = [];

    const userEntities = await fetchByIdsFn(entityIds);
    const appEntities = await fetchByHandlesFn(entityHandles);

    userEntities.forEach((e) => existingEntities.push(e));
    appEntities.forEach((e) => existingEntities.push(e));

    if (existingEntities.length !== (entityIds.length + entityHandles.length)) {
      const missingEntities: string[] = [];

      entityIds.forEach((i) => {
        const me = existingEntities.find((e) => e.id === i);

        if (!me) {
          missingEntities.push(i);
        }
      });

      entityHandles.forEach((h) => {
        const me = existingEntities.find((e) => e.handle === h);

        if (!me) {
          missingEntities.push(h);
        }
      });

      const reason = (
        missingEntities.length === 0
      ) ? (
        `${entityName} count does not match, this means there are duplicate ${entityName}s either on the user record or the resource definition, cowardly refusing to continue`
      ) : (
        `non-existing ${entityName}(s) (${missingEntities.join()})`
      );

      this.logAbilityEvaluation({
        logFn: this.logFn,
        userId,
        wasAllowed: false,
        resourceName,
        resourceIdentifier,
        reason,
      });

      throw new Error(reason);
    }

    return {
      userEntities,
      appEntities,
    };
  };

  evaluateAbilities = async (
    user: DoorLockUser,
    {
      roleHandles,
      permissionHandles,
      restrictionHandles,
      resourceName,
      resourceIdentifier,
    }: DoorLockEvaluationOptions,
  ): Promise<boolean | never> => {
    if (this.checkSuperAdmin(user)) {
      this.logAbilityEvaluation({
        logFn: this.logFn,
        userId: user.id,
        wasAllowed: true,
        resourceName,
        resourceIdentifier,
        reason: 'is super admin',
      });

      return true;
    }

    if (roleHandles.length + permissionHandles.length + restrictionHandles.length < 1) {
      this.logAbilityEvaluation({
        logFn: this.logFn,
        userId: user.id,
        wasAllowed: false,
        resourceName,
        resourceIdentifier,
        reason: 'only super admin allowed',
      });

      throw new Error('Unauthorized');
    }

    const {
      id,
      roles,
      abilities: {
        permissions,
        restrictions,
      },
    } = user;

    let userRoles: DoorLockRole[];
    let userPermissions: DoorLockPermission[];
    let userRestrictions: DoorLockRestriction[];

    let appRoles: DoorLockRole[];
    let appPermissions: DoorLockPermission[];
    let appRestrictions: DoorLockRestriction[];

    if (this.verifyRoleExists) {
      const result = await this.verifyEntityExistence({
        userId: id,
        entityIds: roles,
        entityHandles: roleHandles,
        entityName: 'role',
        resourceName,
        resourceIdentifier,
        fetchByIdsFn: this.fetchRolesById,
        fetchByHandlesFn: this.fetchRolesByHandle,
      });

      userRoles = result['userEntities'];
      appRoles = result['appEntities'];
    } else {
      userRoles = await this.fetchRolesById(roles);
      appRoles = await this.fetchRolesByHandle(roleHandles);
    }

    if (this.verifyAbilitiesExist) {
      const resultP = await this.verifyEntityExistence({
        userId: id,
        entityIds: permissions,
        entityHandles: permissionHandles,
        entityName: 'permission',
        resourceName,
        resourceIdentifier,
        fetchByIdsFn: this.fetchPermissionsById,
        fetchByHandlesFn: this.fetchPermissionsByHandle,
      });

      userPermissions = resultP['userEntities'];
      appPermissions = resultP['appEntities'];

      const resultR = await this.verifyEntityExistence({
        userId: id,
        entityIds: restrictions,
        entityHandles: restrictionHandles,
        entityName: 'restriction',
        resourceName,
        resourceIdentifier,
        fetchByIdsFn: this.fetchRestrictionsById,
        fetchByHandlesFn: this.fetchRestrictionsByHandle,
      });

      userRestrictions = resultR['userEntities'];
      appRestrictions = resultR['appEntities'];
    } else {
      userPermissions = await this.fetchPermissionsById(permissions);
      userRestrictions = await this.fetchRestrictionsById(restrictions);

      appPermissions = await this.fetchPermissionsByHandle(permissionHandles);
      appRestrictions = await this.fetchRestrictionsByHandle(restrictionHandles);
    }

    if (userRoles.length + userPermissions.length < 1) {
      this.logAbilityEvaluation({
        logFn: this.logFn,
        userId: user.id,
        wasAllowed: false,
        resourceName,
        resourceIdentifier,
        reason: 'user has no permissions whatsoever',
      });

      throw new Error('Unauthorized');
    }

    const isPermittedByRole = userRoles.reduce(
      (a, b) => (
        a 
        || (typeof appRoles.find((r) => b.id === r.id) !== 'undefined')
        || b.abilities.permissions.reduce(
          (j, i) => j || (typeof appPermissions.find((p) => i === p.id) !== 'undefined'),
          false,
        )
      ),
      false,
    );

    const isPermittedByPermissions = userPermissions.reduce(
      (a, b) => a || (typeof appPermissions.find((r) => b.id === r.id) !== 'undefined'),
      false,
    );

    const isNotRestricted = userRestrictions.reduce(
      (a, b) => a && !appRestrictions.includes(b),
      true,
    );

    if ((isPermittedByRole || isPermittedByPermissions) && isNotRestricted) {
      this.logAbilityEvaluation({
        logFn: this.logFn,
        userId: user.id,
        wasAllowed: true,
        resourceName,
        resourceIdentifier,
        reason: 'user has the proper permissions and no restrictions',
      });

      return true;
    }

    this.logAbilityEvaluation({
      logFn: this.logFn,
      userId: user.id,
      wasAllowed: false,
      resourceName,
      resourceIdentifier,
      reason: 'non of the user permissions match resource requirements',
    });

    throw new Error('Unauthorized');
  };
}

export default DoorLock;
