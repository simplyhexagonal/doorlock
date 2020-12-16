// MOCK UTIL CODE (ignore)
const crypto=require("crypto");const algorithm="aes-256-ctr";const secretKey="c3SpXZy9DQEqlUU2mAD2VhqW9WHaHXnk";const decrypt=hash=>{const[iv,content]=hash.split(".");const decipher=crypto.createDecipheriv(algorithm,secretKey,Buffer.from(iv,"hex"));const decrpyted=Buffer.concat([decipher.update(Buffer.from(content,"hex")),decipher.final()]);return decrpyted.toString()};
const reqCallback=response=>{let str="";response.on("data",(chunk=>{str+=chunk}));response.on("end",(()=>{console.log('HTTP response:',str)}))};
// END MOCK UTIL CODE (ignore)

// MOCK DATA
const permissions = [
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
];

const restrictions = [];

const roles = [
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

const users = [
  {
    // Token: b6a048b0a871ed9e732391357d93ae92.3e259838da08
    id: 'B0O8fG',
    roles: [],
    abilities: {
      permissions: [],
      restrictions: [],
    },
  },
  {
    // Token: eb57d5dbc40569ff9ace9bc4dfac54de.defe57ef9910
    id: 'IHpwes',
    roles: [
      {
        id: 'iukS74',
      },
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
  },
  {
    // Token: 2e412d7407690b2a24198a9c63d17abe.b3980c0ce112
    id: 'TAcDSA',
    roles: [
      {
        id: 'sl4dJP',
      },
    ],
    abilities: {
      permissions: [],
      restrictions: [],
    },
  },
];
// END MOCK DATA

// ==============
// DoorLock Setup
// ==============
const DoorLock = require('doorlock');

const fetchRolesById = (roleIds) => Promise.resolve(roles.filter((r) => roleIds.includes(r.id)));
const fetchPermissionsById = (permissionIds) => Promise.resolve(permissions.filter((p) => permissionIds.includes(p.id)));
const fetchRestrictionsById = (restrictionIds) => Promise.resolve(restrictions.filter((r) => restrictionIds.includes(r.id)));
const fetchRolesByHandle = (roleHandles) => Promise.resolve(roles.filter((r) => roleHandles.includes(r.handle)));
const fetchPermissionsByHandle = (permissionHandles) => Promise.resolve(permissions.filter((p) => permissionHandles.includes(p.handle)));
const fetchRestrictionsByHandle = (restrictionHandles) => Promise.resolve(restrictions.filter((r) => restrictionHandles.includes(r.handle)));

const doorlock = new DoorLock({
  superAdminId: 'B0O8fG',
  fetchRolesById,
  fetchPermissionsById,
  fetchRestrictionsById,
  fetchRolesByHandle,
  fetchPermissionsByHandle,
  fetchRestrictionsByHandle,
  verifyRoleExists: true,
  verifyAbilitiesExist: true,
  debug: true,
  logFn: (message) => console.log('DOORLOCK RESULT =>', message),
});
// ==================
// End DoorLock Setup
// ==================

const http = require('http');

const requestListener = (req, res) => {
  const {
    url,
    headers,
  } = req;

  const {
    token,
  } = headers;

  if (!token) {
    res.writeHead(401);
    res.end('Unauthorized');
    return;
  }

  const userId = decrypt(token);

  const user = users.find((u) => u.id === userId);

  // Define server routes
  switch (url) {
    case '/api/doc/create':
      doorlock.evaluateAbilities(
        user,
        {
          roleHandles: ['author'],
          permissionHandles: [],
          restrictionHandles: [],
        },
      ).then(() => {
        res.writeHead(200);
        res.end(`User ${userId} is allowed to create documents`);
      }).catch(() => {
        res.writeHead(401);
        res.end(`User ${userId} is NOT allowed to create documents`);
      });

      break;
    case '/api/doc':
      doorlock.evaluateAbilities(
        user,
        {
          roleHandles: [],
          permissionHandles: ['doc-read'], // <== This allows both author and viewer
          restrictionHandles: [],
        },
      ).then(() => {
        res.writeHead(200);
        res.end(`User ${userId} is allowed to read documents`);
      }).catch(() => {
        res.writeHead(401);
        res.end(`User ${userId} is NOT allowed to read documents`);
      });

      break;
    default:
      break;
  }
}

const server = http.createServer(requestListener);
server.listen(8080, () => {
  console.log('Server started on port 8080');

  // Super Admin Request to Create Document
  http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/doc/create',
      headers: {'token': 'b6a048b0a871ed9e732391357d93ae92.3e259838da08'}
    },
    reqCallback,
  ).end();

  // Author Request to Create Document
  http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/doc/create',
      headers: {'token': 'eb57d5dbc40569ff9ace9bc4dfac54de.defe57ef9910'}
    },
    reqCallback,
  ).end();

  // Viewer Request to Create Document
  http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/doc/create',
      headers: {'token': '2e412d7407690b2a24198a9c63d17abe.b3980c0ce112'}
    },
    reqCallback,
  ).end();

  // ================
  // ================
  // ================

  // Super Admin Request to Read Document
  http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/doc',
      headers: {'token': 'b6a048b0a871ed9e732391357d93ae92.3e259838da08'}
    },
    reqCallback,
  ).end();

  // Author Request to Read Document
  http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/doc',
      headers: {'token': 'eb57d5dbc40569ff9ace9bc4dfac54de.defe57ef9910'}
    },
    reqCallback,
  ).end();

  // Viewer Request to Read Document
  http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/doc',
      headers: {'token': '2e412d7407690b2a24198a9c63d17abe.b3980c0ce112'}
    },
    reqCallback,
  ).end();
});
