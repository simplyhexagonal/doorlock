import { DoorLockRestriction, } from '../dist/doorlock';

const restrictions: DoorLockRestriction[] = [
  {
    entityId: 'xj5bDL',
    name: 'Block Delete Doc',
    handle: 'deny-doc-delete',
    description: 'deny access to delete a document',
  },
  {
    entityId: 'v4chur',
    name: 'Dummy Restriction',
    handle: 'deny-dummy',
    description: 'because, why not?',
  },
];

export default (async () => restrictions);
