export default {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    age: { type: 'number'},
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['username', 'password'],
  additionalProperties: false,
};
