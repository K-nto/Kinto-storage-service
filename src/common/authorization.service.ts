import {testUsers} from '../users/testUsers';

/** Returns true if the request is originated by a valid public/private key pair
 * Probably better in the HL Authenticator class
 */
export const authorized = (userId: string, authToken: string = '') => {
  // @TODO: authorize for realsies
  // call HL authenticator here or sth
  return (
    authToken &&
    testUsers.find(user => user.address === userId) &&
    userId == authToken
  );
};
