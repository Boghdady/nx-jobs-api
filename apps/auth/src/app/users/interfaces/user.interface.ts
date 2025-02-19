import { User } from '../models/user.model';
//  we still need it for our tests. Let's create a separate interface for the internal user representation that includes the password field
export interface IUser extends User {
  password: string;
}
