
export const isEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  // eslint-disable-next-line
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(emailRegEx)) return true;
  return false;
};

export const isNotEmail = (email: string): boolean => !isEmail(email);
