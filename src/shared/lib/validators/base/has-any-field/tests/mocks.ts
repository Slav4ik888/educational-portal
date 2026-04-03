interface Schema {
  id               : number
  condition        : any
  status           : any
  userId           : string
  companyId        : string
  taskId           : string
  replyToMessageId : number
  fromId           : string // userId
  fromName         : string
  fromAvatarUrl    : string
  toId             : string // userId
  message          : string
  createdAt        : number // Timestamp
  lastChange       : number
  changes          : []
  readed           : number // Readed date
}


export const schema: Schema = {
  id               : 1,
  condition        : {},
  status           : {},
  userId           : 'string',
  companyId        : 'string',
  taskId           : 'string',
  replyToMessageId : 12,
  fromId           : 'string',
  fromName         : 'string',
  fromAvatarUrl    : 'string',
  toId             : 'string',
  message          : 'string',
  createdAt        : 123,
  lastChange       : 234,
  changes          : [],
  readed           : 1232
};

export const objWithoutSomeFields = {
  id               : 1,
  condition        : {},
  status           : {},
  userId           : 'string',
  companyId        : 'string',
  taskId           : 'string',
  replyToMessageId : 12,
  fromId           : 'string',
  fromName         : 'string',
  fromAvatarUrl    : 'string',
  toId             : 'string',
  message          : 'string',
};

export const objWithOneAnyField = {
  id               : 1,
  condition        : {},
  status           : {},
  userId           : 'string',
  companyId        : 'string',
  taskId           : 'string',
  replyToMessageId : 12,
  fromId           : 'string',
  fromName         : 'string',
  fromAvatarUrl    : 'string',
  toId             : 'string',
  message          : 'string',
  createdAt        : 123,
  lastChange       : 234,
  changes          : [],
  readed           : 1232,
  any              : 1232
};

export const objWithManyAnyFields = {
  id               : 1,
  condition        : {},
  status           : {},
  userId           : 'string',
  companyId        : 'string',
  taskId           : 'string',
  replyToMessageId : 12,
  fromId           : 'string',
  fromName         : 'string',
  fromAvatarUrl    : 'string',
  toId             : 'string',
  message          : 'string',
  any1             : 1232,
  any2             : 1232,
  any3             : 'string'
};
