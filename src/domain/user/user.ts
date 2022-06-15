export interface IUser {
  addPoint(value: number): User;
  subPoint(value: number): User;
}

export class User implements IUser {
  readonly id: string;
  readonly name: string;
  readonly point: number;

  constructor(id: string, name: string, point: number) {
    this.id = id;
    this.name = name;
    this.point = point;
  }

  addPoint(value: number) {
    return new User(this.id, this.name, this.point + value);
  }

  subPoint(value: number) {
    return new User(this.id, this.name, this.point - value);
  }
}
