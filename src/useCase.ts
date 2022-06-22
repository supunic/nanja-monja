import { Card } from './domain/card/card';
import { Deck } from './domain/card/deck';
import { UsedCards } from './domain/card/usedCards';
import { User } from './domain/user/user';
import { Users } from './domain/user/users';

const initCard = (imagePath: string) => {
  // 名前、趣味、親は空文字で初期化
  return new Card(imagePath, ``, ``, ``);
};

export const initDeck = (imagePaths: string[]) => {
  // 各画像ごとに4枚ずつカード化して初期化
  const imagePathsX4 = [];

  for (const imagePath of imagePaths) {
    imagePathsX4.push(imagePath);
    imagePathsX4.push(imagePath);
    imagePathsX4.push(imagePath);
    imagePathsX4.push(imagePath);
  }

  const deck = new Deck(imagePathsX4.map((path) => initCard(path)));
  deck.shuffle();

  return deck;
};

export const initUsedCards = () => {
  // 空配列で初期化
  return new UsedCards([]);
};

export const createUser = (id: string, name: string) => {
  // ポイント0で初期化
  return new User(id, name, 0);
};

export const initUsers = (fetchUsers: Users) => {
  // fetchしてきたusersで初期化
  return new Users(fetchUsers.users);
};
