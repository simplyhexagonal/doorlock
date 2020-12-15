import { DoorLockRestriction, } from '../../src/interfaces';

const restrictions: DoorLockRestriction[] = [
  {
    id: 'xj5bDL',
    name: 'Block Delete Doc',
    handle: 'deny-doc-delete',
    description: 'deny access to delete a document',
  },
  {
    id: 'v4chur',
    name: 'Dummy Restriction',
    handle: 'deny-dummy',
    description: 'because, why not?',
  },
];

export default (async () => restrictions);
