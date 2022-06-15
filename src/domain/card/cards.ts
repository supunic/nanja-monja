import { Card } from './card';

export interface ICards {
  count(): number;
}

export class Cards implements ICards {
  readonly cards: Card[];

  constructor(cards: Card[]) {
    this.cards = cards;
  }

  count() {
    return this.cards.length;
  }

  protected _push(card: Card) {
    this.cards.push(card);

    return new Cards(this.cards);
  }

  protected _shift() {
    const card = this.cards.shift() ?? null;

    return { card, cards: this.cards };
  }

  protected _changeSameCardsStatuses = (
    imagePath: string,
    name: string,
    hobby: string,
    author: string,
  ) => {
    const newCards = new Cards([]);

    for (const card of this.cards) {
      if (card.imagePath === imagePath) {
        const newCard = card
          .changeName(name)
          .changeHobby(hobby)
          .changeAuthor(author);

        newCards._push(newCard);
      } else {
        newCards._push(card);
      }
    }

    return newCards;
  };
}
