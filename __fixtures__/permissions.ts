import { DoorLockPermission, } from '../dist/doorlock';

const permissions: DoorLockPermission[] = [
  {
    entityId: 'e6crPQ',
    name: 'Handle Access',
    handle: 'permission',
    description: 'permission to view and edit permissions'
  },
  {
    entityId: 'OK00eo',
    name: 'Create Doc',
    handle: 'doc-create',
    description: 'permission to create a document',
  },
  {
    entityId: 'kvK4B3',
    name: 'Read Doc',
    handle: 'doc-read',
    description: 'permission to view a document',
  },
  {
    entityId: 'Sl5ile',
    name: 'Update Doc',
    handle: 'doc-update',
    description: 'permission to edit a document',
  },
  {
    entityId: 'Tj0rxW',
    name: 'Delete Doc',
    handle: 'doc-delete',
    description: 'permission to delete a document',
  },
];

export default (async () => permissions);
