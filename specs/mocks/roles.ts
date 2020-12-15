import { DoorLockRole, } from '../../src/interfaces';

const roles: DoorLockRole[] = [
  {
    id: '7asPS1',
    name: 'Admin',
    handle: 'admin',
    description: 'Administrator access',
    abilities: {
      permissions: [
        {
          id: 'e6crPQ', // Handle Access
        },
        {
          id: 'OK00eo', // Create Doc
        },
        {
          id: 'kvK4B3', // Read Doc
        },
        {
          id: 'Sl5ile', // Update Doc
        },
        {
          id: 'Tj0rxW' // Delete Doc
        },
      ],
      restrictions: [],
    },
  },
  {
    id: 'iukS74',
    name: 'Author',
    handle: 'author',
    description: 'Author access',
    abilities: {
      permissions: [
        {
          id: 'OK00eo', // Create Doc
        },
        {
          id: 'kvK4B3', // Read Doc
        },
        {
          id: 'Sl5ile', // Update Doc
        },
        {
          id: 'Tj0rxW' // Delete Doc
        },
      ],
      restrictions: [],
    },
  },
  {
    id: 'R94YYO',
    name: 'Diva Author',
    handle: 'diva-author',
    description: 'Author access for hot-headed authors',
    abilities: {
      permissions: [
        {
          id: 'OK00eo', // Create Doc
        },
        {
          id: 'kvK4B3', // Read Doc
        },
        {
          id: 'Sl5ile', // Update Doc
        },
        {
          id: 'Tj0rxW' // Delete Doc
        },
      ],
      restrictions: [
        {
          id: 'xj5bDL',
        }
      ],
    },
  },
  {
    id: 'fpmYTG',
    name: 'Editor',
    handle: 'editor',
    description: 'Editor access',
    abilities: {
      permissions: [
        {
          id: 'kvK4B3', // Read Doc
        },
        {
          id: 'Sl5ile', // Update Doc
        },
      ],
      restrictions: [],
    },
  },
  {
    id: 'sl4dJP',
    name: 'Viewer',
    handle: 'viewer',
    description: 'Viewer access',
    abilities: {
      permissions: [
        {
          id: 'kvK4B3', // Read Doc
        },
      ],
      restrictions: [],
    },
  },
];

export default (async () => roles);
