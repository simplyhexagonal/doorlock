export interface DoorLockEntity {
    entityId: string;
    name: string;
    handle: string;
    description: string;
    [key: string]: any;
}
export interface DoorLockPermission extends DoorLockEntity {
}
export interface DoorLockRestriction extends DoorLockEntity {
}
export interface DoorLockAbilities {
    permissions: DoorLockPermission['entityId'][];
    restrictions: DoorLockRestriction['entityId'][];
}
export interface DoorLockAbilityDescriptions {
    permissions: DoorLockPermission['description'][];
    restrictions: DoorLockRestriction['description'][];
}
export interface DoorLockRole extends DoorLockEntity {
    abilities: DoorLockAbilities;
}
export interface DoorLockUser {
    userId: string;
    roles: DoorLockRole['entityId'][];
    abilities: DoorLockAbilities;
    [key: string]: any;
}
export interface DoorLockOptions {
    superAdminId: DoorLockUser['userId'];
    fetchRolesById: (roleIds: DoorLockRole['entityId'][]) => Promise<DoorLockRole[]>;
    fetchPermissionsById: (permissionIds: DoorLockPermission['entityId'][]) => Promise<DoorLockPermission[]>;
    fetchRestrictionsById: (restrictionIds: DoorLockRestriction['entityId'][]) => Promise<DoorLockRestriction[]>;
    fetchRolesByHandle: (roleHandles: DoorLockRole['handle'][]) => Promise<DoorLockRole[]>;
    fetchPermissionsByHandle: (permissionHandles: DoorLockPermission['handle'][]) => Promise<DoorLockPermission[]>;
    fetchRestrictionsByHandle: (restrictionHandles: DoorLockRestriction['handle'][]) => Promise<DoorLockRestriction[]>;
    verifyRoleExists?: boolean;
    verifyAbilitiesExist?: boolean;
    debug?: boolean;
    logFn?: (...args: any[]) => void | ((...args: any[]) => Promise<void>);
}
