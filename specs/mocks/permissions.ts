import { DoorLockPermission, } from '../../src/interfaces';

const permissions: DoorLockPermission[] = [
  {
    id: 'e6crPQ',
    name: 'Handle Access',
    handle: 'permission',
    description: 'permission to view and edit permissions'
  },
  {
    id: 'OK00eo',
    name: 'Create Doc',
    handle: 'doc-create',
    description: 'permission to create a document',
  },
  {
    id: 'kvK4B3',
    name: 'Read Doc',
    handle: 'doc-read',
    description: 'permission to view a document',
  },
  {
    id: 'Sl5ile',
    name: 'Update Doc',
    handle: 'doc-update',
    description: 'permission to edit a document',
  },
  {
    id: 'Tj0rxW',
    name: 'Delete Doc',
    handle: 'doc-delete',
    description: 'permission to delete a document',
  },
];

export default (async () => permissions);
