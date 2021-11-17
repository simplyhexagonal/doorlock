var Doorlock = (() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });

  // package.json
  var version = "2.0.1";

  // src/index.ts
  var DoorLock = class {
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
      logFn
    }) {
      this.verifyRoleExists = false;
      this.verifyAbilitiesExist = false;
      this.debug = false;
      this.logFn = console.log;
      this.checkSuperAdmin = ({ userId }) => {
        if (this.superAdminId && userId === this.superAdminId) {
          return true;
        }
        return false;
      };
      this.logAbilityEvaluation = ({
        userId,
        wasAllowed,
        resourceName,
        resourceIdentifier,
        reason
      }) => {
        if (this.debug) {
          let message = `user ${userId} was ${wasAllowed ? "allowed" : "not allowed"} access`;
          message += resourceName || resourceIdentifier ? ` to ${resourceName ? `${resourceName}` : ""} ${resourceIdentifier ? `${resourceIdentifier}` : ""}` : "";
          message += reason ? ` due to: ${reason}` : "";
          this.logFn(message);
        }
      };
      this.verifyEntityExistence = async ({
        userId,
        entityHandles,
        entityIds,
        entityName,
        resourceName,
        resourceIdentifier,
        fetchByIdsFn,
        fetchByHandlesFn
      }) => {
        const existingEntities = [];
        const userEntities = await fetchByIdsFn(entityIds);
        const appEntities = await fetchByHandlesFn(entityHandles);
        userEntities.forEach((e) => existingEntities.push(e));
        appEntities.forEach((e) => existingEntities.push(e));
        if (existingEntities.length !== entityIds.length + entityHandles.length) {
          const missingEntities = [];
          entityIds.forEach((i) => {
            const me = existingEntities.find((e) => e.entityId === i);
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
          const reason = missingEntities.length === 0 ? `${entityName} count does not match, this means there are duplicate ${entityName}s either on the user record or the resource definition, cowardly refusing to continue` : `non-existing ${entityName}(s) (${missingEntities.join()})`;
          this.logAbilityEvaluation({
            userId,
            wasAllowed: false,
            resourceName,
            resourceIdentifier,
            reason
          });
          throw new Error(reason);
        }
        return {
          userEntities,
          appEntities
        };
      };
      this.evaluateAbilities = async (user, {
        roleHandles,
        permissionHandles,
        restrictionHandles,
        resourceName,
        resourceIdentifier
      }) => {
        if (this.checkSuperAdmin(user)) {
          this.logAbilityEvaluation({
            userId: user.userId,
            wasAllowed: true,
            resourceName,
            resourceIdentifier,
            reason: "is super admin"
          });
          return true;
        }
        if (roleHandles.length + permissionHandles.length + restrictionHandles.length < 1) {
          this.logAbilityEvaluation({
            userId: user.userId,
            wasAllowed: false,
            resourceName,
            resourceIdentifier,
            reason: "only super admin allowed"
          });
          throw new Error("Unauthorized");
        }
        const {
          userId,
          roles,
          abilities: {
            permissions,
            restrictions
          }
        } = user;
        let userRoles;
        let userPermissions;
        let userRestrictions;
        let appRoles;
        let appPermissions;
        let appRestrictions;
        if (this.verifyRoleExists) {
          const result = await this.verifyEntityExistence({
            userId,
            entityIds: roles,
            entityHandles: roleHandles,
            entityName: "role",
            resourceName,
            resourceIdentifier,
            fetchByIdsFn: this.fetchRolesById,
            fetchByHandlesFn: this.fetchRolesByHandle
          });
          userRoles = result["userEntities"];
          appRoles = result["appEntities"];
        } else {
          userRoles = await this.fetchRolesById(roles);
          appRoles = await this.fetchRolesByHandle(roleHandles);
        }
        if (this.verifyAbilitiesExist) {
          const resultP = await this.verifyEntityExistence({
            userId,
            entityIds: permissions,
            entityHandles: permissionHandles,
            entityName: "permission",
            resourceName,
            resourceIdentifier,
            fetchByIdsFn: this.fetchPermissionsById,
            fetchByHandlesFn: this.fetchPermissionsByHandle
          });
          userPermissions = resultP["userEntities"];
          appPermissions = resultP["appEntities"];
          const resultR = await this.verifyEntityExistence({
            userId,
            entityIds: restrictions,
            entityHandles: restrictionHandles,
            entityName: "restriction",
            resourceName,
            resourceIdentifier,
            fetchByIdsFn: this.fetchRestrictionsById,
            fetchByHandlesFn: this.fetchRestrictionsByHandle
          });
          userRestrictions = resultR["userEntities"];
          appRestrictions = resultR["appEntities"];
        } else {
          userPermissions = await this.fetchPermissionsById(permissions);
          userRestrictions = await this.fetchRestrictionsById(restrictions);
          appPermissions = await this.fetchPermissionsByHandle(permissionHandles);
          appRestrictions = await this.fetchRestrictionsByHandle(restrictionHandles);
        }
        if (userRoles.length + userPermissions.length < 1) {
          this.logAbilityEvaluation({
            userId: user.userId,
            wasAllowed: false,
            resourceName,
            resourceIdentifier,
            reason: "user has no permissions whatsoever"
          });
          throw new Error("Unauthorized");
        }
        const isPermittedByRole = userRoles.reduce((a, b) => a || typeof appRoles.find((r) => b.entityId === r.entityId) !== "undefined" || b.abilities.permissions.reduce((j, i) => j || typeof appPermissions.find((p) => i === p.entityId) !== "undefined", false), false);
        const isPermittedByPermissions = userPermissions.reduce((a, b) => a || typeof appPermissions.find((r) => b.entityId === r.entityId) !== "undefined", false);
        const isNotRestricted = userRestrictions.reduce((a, b) => a && !appRestrictions.includes(b), true);
        if ((isPermittedByRole || isPermittedByPermissions) && isNotRestricted) {
          this.logAbilityEvaluation({
            userId: user.userId,
            wasAllowed: true,
            resourceName,
            resourceIdentifier,
            reason: "user has the proper permissions and no restrictions"
          });
          return true;
        }
        this.logAbilityEvaluation({
          userId: user.userId,
          wasAllowed: false,
          resourceName,
          resourceIdentifier,
          reason: "non of the user permissions match resource requirements"
        });
        throw new Error("Unauthorized");
      };
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
      this.logFn = logFn || this.logFn;
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
        logFn
      });
    }
  };
  DoorLock.version = version;
  var src_default = DoorLock;
  return src_exports;
})();
//# sourceMappingURL=doorlock.js.map
'undefined'!=typeof module&&(module.exports=Doorlock.default),'undefined'!=typeof window&&(Doorlock=Doorlock.default);