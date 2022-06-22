import { User } from '@/domain/user/user';
import {
  Firestore,
  FirestoreDataConverter,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { MyFirebaseClient } from './firebaseClient';

const NAME = `users`;

export interface IUserClient {
  fetch(): Promise<DocumentSnapshot<User>>;
  fetchAll(): Promise<QuerySnapshot<User>>;
  set(params: User, id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export class UserClient extends MyFirebaseClient<User> implements IUserClient {
  constructor(db: Firestore, converter: FirestoreDataConverter<User>) {
    super(NAME, db, converter);
  }
}
