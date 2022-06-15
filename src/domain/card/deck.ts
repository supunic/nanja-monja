import { Card } from './card';
import { Cards, ICards } from './cards';

export interface IDeck extends ICards {
  shuffle(): void;
  draw(): { card: Card | null; deck: Deck };
  changeSameCardsStatuses(
    imagePath: string,
    name: string,
    hobby: string,
    author: string,
  ): Deck;
}

export class Deck extends Cards implements IDeck {
  constructor(cards: Card[]) {
    super(cards);
  }

  shuffle() {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    const { card, cards } = this._shift();

    return { card, deck: new Deck(cards) };
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

    return new Deck(newCards.cards);
  }
}
