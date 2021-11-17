import { DoorLockRole, } from '../dist/doorlock';

const roles: DoorLockRole[] = [
  {
    entityId: '7asPS1',
    name: 'Admin',
    handle: 'admin',
    description: 'Administrator access',
    abilities: {
      permissions: [
        'e6crPQ', // Handle Access
        'OK00eo', // Create Doc
        'kvK4B3', // Read Doc
        'Sl5ile', // Update Doc
        'Tj0rxW' // Delete Doc
      ],
      restrictions: [],
    },
  },
  {
    entityId: 'iukS74',
    name: 'Author',
    handle: 'author',
    description: 'Author access',
    abilities: {
      permissions: [
        'OK00eo', // Create Doc
        'kvK4B3', // Read Doc
        'Sl5ile', // Update Doc
        'Tj0rxW' // Delete Doc
      ],
      restrictions: [],
    },
  },
  {
    entityId: 'R94YYO',
    name: 'Diva Author',
    handle: 'diva-author',
    description: 'Author access for hot-headed authors',
    abilities: {
      permissions: [
        'OK00eo', // Create Doc
        'kvK4B3', // Read Doc
        'Sl5ile', // Update Doc
        'Tj0rxW' // Delete Doc
      ],
      restrictions: [
        'xj5bDL',
      ],
    },
  },
  {
    entityId: 'fpmYTG',
    name: 'Editor',
    handle: 'editor',
    description: 'Editor access',
    abilities: {
      permissions: [
        'kvK4B3', // Read Doc
        'Sl5ile', // Update Doc
      ],
      restrictions: [],
    },
  },
  {
    entityId: 'sl4dJP',
    name: 'Viewer',
    handle: 'viewer',
    description: 'Viewer access',
    abilities: {
      permissions: [
        'kvK4B3', // Read Doc
      ],
      restrictions: [],
    },
  },
];

export default (async () => roles);
