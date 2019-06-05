import bcrypt from 'bcrypt';

export const salt = bcrypt.genSaltSync(5);
export const users = [
  {
    id: 1,
    email: `ola357@yahoo.com`,
    firstName: 'olaoluwa',
    lastName: 'alli',
    password: bcrypt.hashSync('abc123', salt),
    address: "lagos",
    is_admin: true,
  },
  {
    id: 2,
    email: `bim007@gmail.com`,
    firstName: 'bimbo',
    lastName: 'lawal',
    password: bcrypt.hashSync('efg678', salt),
    address: "ekiti",
    is_admin: false,
  },
  {
    id: 3,
    email: `ada90@gmail.com`,
    firstName: 'adaoma',
    lastName: 'jiburu',
    password: bcrypt.hashSync('nitro89', salt),
    address: "enugu",
    is_admin: false,
  },
];
