export interface ICard {
  changeName(name: string): Card;
  changeHobby(hobby: string): Card;
  changeAuthor(author: string): Card;
}

export class Card implements ICard {
  readonly imagePath: string;
  readonly name: string;
  readonly hobby: string;
  readonly author: string;

  constructor(imagePath: string, name: string, hobby: string, author: string) {
    this.imagePath = imagePath;
    this.name = name;
    this.hobby = hobby;
    this.author = author;
  }

  changeName(name: string) {
    return new Card(this.imagePath, name, this.hobby, this.author);
  }

  changeHobby(hobby: string) {
    return new Card(this.imagePath, this.name, hobby, this.author);
  }

  changeAuthor(author: string) {
    return new Card(this.imagePath, this.name, this.hobby, author);
  }
}
