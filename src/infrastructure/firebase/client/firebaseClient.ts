import {
  Firestore,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';

export interface IMyFirebaseClient {
  fetch(): Promise<DocumentSnapshot>;
  fetchAll(): Promise<QuerySnapshot>;
  set(params: object, id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export class MyFirebaseClient<T> implements IMyFirebaseClient {
  protected collectionName: string;
  protected db: Firestore;
  protected converter: FirestoreDataConverter<T>;

  constructor(
    collectionName: string,
    db: Firestore,
    converter: FirestoreDataConverter<T>,
  ) {
    this.collectionName = collectionName;
    this.db = db;
    this.converter = converter;
  }

  async fetch() {
    return await getDoc(
      doc(this.db, this.collectionName).withConverter(this.converter),
    );
  }

  async fetchAll() {
    return await getDocs(
      collection(this.db, this.collectionName).withConverter(this.converter),
    );
  }

  async set(params: object, id: string) {
    console.log(this.collectionName, id, params);
    const a = await setDoc(doc(this.db, this.collectionName, id), {
      aaa: `121`,
    });
  }

  async delete(id: string) {
    await deleteDoc(doc(this.db, this.collectionName, id));
  }
}
