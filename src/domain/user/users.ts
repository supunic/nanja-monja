import { User } from './user';

export interface IUsers {
  count(): number;
  newId(): string;
  join(user: User): Users;
  exit(exitUser: User): Users;
  findById(id: string): User | null;
  updateUser(newUser: User): Users;
}

export class Users implements IUsers {
  readonly users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  count() {
    return this.users.length;
  }

  newId() {
    return String(Math.floor(Math.random() * 10000000));
  }

  join(user: User) {
    this.users.push(user);

    return new Users(this.users);
  }

  exit(exitUser: User) {
    const newUsers = this.users.filter((user) => user.id !== exitUser.id);

    return new Users(newUsers);
  }

  findById(id: string) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  updateUser(newUser: User) {
    const newUsers = this.users.map((user) => {
      return user.id === newUser.id ? newUser : user;
    });

    return new Users(newUsers);
  }
}
