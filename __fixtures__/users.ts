import { DoorLockUser, } from '../dist/doorlock';

interface TestUser extends DoorLockUser {
  pathExpectations: {
    fail: string[];
    pass: string[];
  };
};

const users: TestUser[] = [
  // User with no access
  {
    id: 'YhjGOX',
    roles: [],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'POST /docs',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
      ],
      pass: [],
    },
  },
  // Super Admin
  {
    id: 'B0O8fG',
    roles: [],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [],
      pass: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'POST /docs',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
      ],
    },
  },
  // Admin
  {
    id: 'gVilJi',
    roles: [
      '7asPS1',
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
      ],
      pass: [
        'GET /for-admin-only',
        'POST /docs',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
      ],
    },
  },
  // Author
  {
    id: 'IHpwes',
    roles: [
      'iukS74',
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
      ],
      pass: [
        'POST /docs',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
      ],
    },
  },
  // Diva Author
  // (i.e. These authors are hot headed and known for deleting good progress)
  {
    id: '643ANo',
    roles: [
      'R94YYO',
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'DELETE /docs',
      ],
      pass: [
        'POST /docs',
        'GET /docs',
        'PUT /docs',
      ],
    },
  },
  // Diva Author with a temporary override
  {
    id: 'DW4SXI',
    roles: [
      'R94YYO',
    ],
    abilities: {
      permissions: [
        'Tj0rxW', // doc-delete
      ],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
      ],
      pass: [
        'POST /docs',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
      ],
    },
  },
  // Valued Author
  // (i.e. This author's work is brilliant,
  // we need to avoid accidental deletion of their genius,
  // thus we added a restriction override)
  {
    id: 'qoKPjo',
    roles: [
      'iukS74',
    ],
    abilities: {
      permissions: [],
      restrictions: [
        'xj5bDL',
      ],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'DELETE /docs',
      ],
      pass: [
        'POST /docs',
        'GET /docs',
        'PUT /docs',
      ],
    },
  },
  // Author f-up
  // (i.e. someone messed up and assigned this user both normal and diva author roles)
  {
    id: 'rTx7Wk',
    roles: [
      'iukS74',
      'R94YYO',
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'DELETE /docs',
      ],
      pass: [
        'POST /docs',
        'GET /docs',
        'PUT /docs',
      ],
    },
  },
  // Editor
  {
    id: 'lMg1sI',
    roles: [
      'fpmYTG',
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'POST /docs',
        'DELETE /docs',
      ],
      pass: [
        'GET /docs',
        'PUT /docs',
      ],
    },
  },
  // Trusted Editor
  {
    id: 'lMg1sI',
    roles: [
      'fpmYTG',
    ],
    abilities: {
      permissions: [
        'OK00eo',
      ],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'DELETE /docs',
      ],
      pass: [
        'POST /docs',
        'GET /docs',
        'PUT /docs',
      ],
    },
  },
  // Viewer
  {
    id: 'TAcDSA',
    roles: [
      'sl4dJP',
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'DELETE /docs',
        'POST /docs',
        'PUT /docs',
      ],
      pass: [
        'GET /docs',
      ],
    },
  },
  // Valued Author changed to Viewer
  {
    id: 'oR0k4c',
    roles: [
      'sl4dJP',
    ],
    abilities: {
      permissions: [],
      restrictions: [
        'xj5bDL', // which means this is a left-over restriction
      ],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'DELETE /docs',
        'POST /docs',
        'PUT /docs',
      ],
      pass: [
        'GET /docs',
      ],
    },
  },
  // User with no role, two permissions, and one "conflicting" restriction
  {
    id: 'Ch4Ot2',
    roles: [],
    abilities: {
      permissions: [
        'OK00eo', // doc-create
        'Tj0rxW', // doc-delete
      ],
      restrictions: [
        'xj5bDL', // deny-doc-delete
      ],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
      ],
      pass: [
        'POST /docs',
      ],
    },
  },
  // User with no role, a single permissions "conflicting" with a single restriction
  {
    id: 'tFUCpA',
    roles: [],
    abilities: {
      permissions: [
        'Tj0rxW', // doc-delete
      ],
      restrictions: [
        'xj5bDL', // deny-doc-delete
      ],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
        'POST /docs',
      ],
      pass: [],
    },
  },
  // User with no role, one permissions, and two restriction (one of which "conflicts" with the permission)
  {
    id: 'lDiwbP',
    roles: [],
    abilities: {
      permissions: [
        'Tj0rxW', // doc-delete
      ],
      restrictions: [
        'xj5bDL', // deny-doc-delete
        'v4chur', // deny-dummy
      ],
    },
    // test specific
    pathExpectations: {
      fail: [
        'GET /for-super-admin-only',
        'GET /for-admin-only',
        'GET /docs',
        'PUT /docs',
        'DELETE /docs',
        'POST /docs',
      ],
      pass: [],
    },
  },
];

export default users;
