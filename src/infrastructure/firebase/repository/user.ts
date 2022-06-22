import { User } from '@/domain/user/user';
import { Users } from '@/domain/user/users';
import {
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { UserClient } from '../client/user';

const converter: FirestoreDataConverter<User> = {
  toFirestore(user: User) {
    return user as object;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const user = snapshot.data(options);
    return new User(user.id, user.name, user.point);
  },
};

export interface IUserRepository {
  fetch(): Promise<User | undefined>;
  set(user: User): Promise<void>;
  delete(user: User): Promise<void>;
  fetchAll(): Promise<Users>;
  setAll(users: Users): Promise<void>;
  deleteAll(users: Users): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private client: UserClient;

  constructor(db: Firestore) {
    this.client = new UserClient(db, converter);
  }

  async fetch() {
    const response = await this.client.fetch();

    if (response.exists()) {
      return response.data();
    }
  }

  async set(user: User) {
    await this.client.set(user, user.id);
  }

  async delete(user: User) {
    await this.client.delete(user.id);
  }

  async fetchAll() {
    const response = await this.client.fetchAll();

    let users = new Users([]);

    response.forEach((doc) => {
      if (doc.exists()) {
        users = users.join(doc.data());
      }
    });

    return users;
  }

  async setAll({ users }: Users) {
    await Promise.all(users.map((user) => this.client.set(user, user.id)));
  }

  async deleteAll({ users }: Users) {
    await Promise.all(users.map((user) => this.client.delete(user.id)));
  }
}
