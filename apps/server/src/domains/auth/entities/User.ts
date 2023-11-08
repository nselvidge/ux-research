import { Identity, IdentityTypes } from "./Identity";

export interface AddIdentityEvent {
  userId: string;
  identity: {
    token: string;
    type: IdentityTypes;
  };
  confirmed: boolean;
}

export interface User {
   readonly id: string,
   readonly fullName: string,
   readonly email: string,
   readonly identities: Identity[],
   readonly confirmed: boolean
}

export const userHasIdentity = (user: User, identity: Identity) => {
  const existingIdentity = user.identities.find(
    (current) => current.type === identity.type
  );

  return existingIdentity !== undefined;
};

export const addIdentityToUser = (
  user: User,
  identity: Identity,
  confirmed: boolean
): [User, AddIdentityEvent] => {
  if (userHasIdentity(user, identity)) {
    throw new Error(`identity already exists for type ${identity.type}`);
  }

  return [
    {
      ...user,
      identities: user.identities.concat([identity]),
      confirmed,
    },
    {
      userId: user.id,
      identity: {
        type: identity.type,
        token: identity.token,
      },
      confirmed,
    },
  ];
};
 
export const getUserEmailDomain = (user: User) => {

  const [, domain] = user.email.split("@");

  return domain;
}
