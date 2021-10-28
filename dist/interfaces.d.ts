export interface DoorLockEntity {
    id: string;
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
    permissions: DoorLockPermission['id'][];
    restrictions: DoorLockRestriction['id'][];
}
export interface DoorLockAbilityDescriptions {
    permissions: DoorLockPermission['description'][];
    restrictions: DoorLockRestriction['description'][];
}
export interface DoorLockRole extends DoorLockEntity {
    abilities: DoorLockAbilities;
}
export interface DoorLockUser {
    id: string;
    roles: DoorLockRole['id'][];
    abilities: DoorLockAbilities;
    [key: string]: any;
}
export interface DoorLockOptions {
    superAdminId: DoorLockUser['id'];
    fetchRolesById: (roleIds: DoorLockRole['id'][]) => Promise<DoorLockRole[]>;
    fetchPermissionsById: (permissionIds: DoorLockPermission['id'][]) => Promise<DoorLockPermission[]>;
    fetchRestrictionsById: (restrictionIds: DoorLockRestriction['id'][]) => Promise<DoorLockRestriction[]>;
    fetchRolesByHandle: (roleHandles: DoorLockRole['handle'][]) => Promise<DoorLockRole[]>;
    fetchPermissionsByHandle: (permissionHandles: DoorLockPermission['handle'][]) => Promise<DoorLockPermission[]>;
    fetchRestrictionsByHandle: (restrictionHandles: DoorLockRestriction['handle'][]) => Promise<DoorLockRestriction[]>;
    verifyRoleExists?: boolean;
    verifyAbilitiesExist?: boolean;
    debug?: boolean;
    logFn: (...args: any[]) => void | ((...args: any[]) => Promise<void>);
}
