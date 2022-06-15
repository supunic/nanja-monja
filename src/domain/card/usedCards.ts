import { Card } from './card';
import { Cards, ICards } from './cards';

export interface IUsedCards extends ICards {
  pickLatest(): Card | null;
  add(card: Card): UsedCards;
  changeSameCardsStatuses(
    imagePath: string,
    name: string,
    hobby: string,
    author: string,
  ): UsedCards;
}

export class UsedCards extends Cards implements IUsedCards {
  constructor(cards: Card[]) {
    super(cards);
  }

  pickLatest() {
    if (this.cards.length === 0) return null;

    return this.cards[this.cards.length - 1];
  }

  add(card: Card) {
    const newCards = this._push(card);

    return new UsedCards(newCards.cards);
  }

  changeSameCardsStatuses(
    imagePath: string,
    name: string,
    hobby: string,
    author: string,
  ) {
    const newCards = this._changeSameCardsStatuses(
      imagePath,
      name,
      hobby,
      author,
    );

    return new UsedCards(newCards.cards);
  }
}
