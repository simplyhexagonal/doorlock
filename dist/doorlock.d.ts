import { DoorLockEntity, DoorLockOptions, DoorLockPermission, DoorLockRestriction, DoorLockRole, DoorLockUser } from './interfaces';
export * from './interfaces';
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
declare class DoorLock {
    static version: string;
    superAdminId: string;
    fetchRolesById: DoorLockOptions['fetchRolesById'];
    fetchPermissionsById: DoorLockOptions['fetchPermissionsById'];
    fetchRestrictionsById: DoorLockOptions['fetchRestrictionsById'];
    fetchRolesByHandle: DoorLockOptions['fetchRolesByHandle'];
    fetchPermissionsByHandle: DoorLockOptions['fetchPermissionsByHandle'];
    fetchRestrictionsByHandle: DoorLockOptions['fetchPermissionsByHandle'];
    verifyRoleExists: boolean;
    verifyAbilitiesExist: boolean;
    debug: boolean;
    logFn: DoorLockOptions['logFn'];
    constructor({ superAdminId, fetchRolesById, fetchPermissionsById, fetchRestrictionsById, fetchRolesByHandle, fetchPermissionsByHandle, fetchRestrictionsByHandle, verifyRoleExists, verifyAbilitiesExist, debug, logFn, }: DoorLockOptions);
    checkSuperAdmin: ({ id }: DoorLockUser) => boolean;
    logAbilityEvaluation: ({ logFn, userId, wasAllowed, resourceName, resourceIdentifier, reason, }: DoorLockLogOptions) => void;
    verifyEntityExistence: <T extends DoorLockEntity>({ userId, entityHandles, entityIds, entityName, resourceName, resourceIdentifier, fetchByIdsFn, fetchByHandlesFn, }: {
        userId: DoorLockUser['id'];
        entityIds: DoorLockEntity['id'][];
        entityHandles: DoorLockEntity['handle'][];
        entityName: string;
        resourceName?: string | undefined;
        resourceIdentifier?: string | undefined;
        fetchByIdsFn: (entityIds: DoorLockEntity['id'][]) => Promise<T[]>;
        fetchByHandlesFn: (entityHandles: DoorLockEntity['handle'][]) => Promise<T[]>;
    }) => Promise<{
        userEntities: T[];
        appEntities: T[];
    }>;
    evaluateAbilities: (user: DoorLockUser, { roleHandles, permissionHandles, restrictionHandles, resourceName, resourceIdentifier, }: DoorLockEvaluationOptions) => Promise<boolean | never>;
}
export default DoorLock;
