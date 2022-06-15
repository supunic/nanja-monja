import Image from 'next/image';
import { useState } from 'react';
import { initDeck, initUsedCards } from '@/logic';
import { imagePaths } from '@/const';
import { Deck } from '@/domain/card/deck';
import { UsedCards } from '@/domain/card/usedCards';
import { pose } from '@/util';

export default function Home() {
  const [deck, setDeck] = useState<Deck>(initDeck(imagePaths));
  const [usedCards, setUsedCards] = useState<UsedCards>(initUsedCards());
  const [showName, setShowName] = useState<boolean>(false);
  const [showHobby, setShowHobby] = useState<boolean>(false);
  const [showAuthor, setShowAuthor] = useState<boolean>(false);

  const handleShuffleButtonClicked = () => deck.shuffle();

  const handleDrawButtonClicked = async () => {
    setShowName(false);
    setShowHobby(false);
    setShowAuthor(false);

    const { card, deck: newDeck } = deck.draw();

    setDeck(newDeck);

    if (card === null) {
      alert(`山札がありません`);
      return;
    }

    const addedCards = usedCards.add(card);

    setUsedCards(addedCards);

    if (card.name === ``) {
      // 画像ロードが終わってからprompt表示したいため少し処理を遅延
      await pose(1);

      const name = prompt(`名前をつけてください`) ?? ``;
      const hobby = prompt(`趣味を決めてください`) ?? ``;
      const author = prompt(`親を入れてください`) ?? ``;

      const newDeck = deck.changeSameCardsStatuses(
        card.imagePath,
        name,
        hobby,
        author,
      );

      const newUsedCards = usedCards.changeSameCardsStatuses(
        card.imagePath,
        name,
        hobby,
        author,
      );

      setDeck(newDeck);
      setUsedCards(newUsedCards);

      setShowName(true);
      setShowHobby(true);
      setShowAuthor(true);
    }
  };

  const handleResetButtonClicked = () => {
    setDeck(initDeck(imagePaths));
    setUsedCards(initUsedCards());
  };

  const handleShowNameButtonClicked = () => setShowName(true);

  const handleShowHobbyButtonClicked = () => setShowHobby(true);

  const handleShowAuthorButtonClicked = () => setShowAuthor(true);

  return (
    <div style={{ width: `1000px`, margin: `0 auto` }}>
      <h2>なんじゃもんじゃああああああ</h2>
      <div style={{ display: `flex`, gap: `4px` }}>
        <button onClick={handleDrawButtonClicked}>ドロー</button>
        <button onClick={handleShuffleButtonClicked}>シャッフル</button>
        {deck.count() === 0 && (
          <button onClick={handleResetButtonClicked}>リセット</button>
        )}
      </div>
      <div>
        <p>山札：{deck.count()}枚</p>
      </div>
      <div>
        <p>場：{usedCards.count()}枚</p>
        <div>
          {usedCards.pickLatest() && (
            <div
              style={{ display: `flex`, flexDirection: `column`, gap: `8px` }}
            >
              <div
                style={{ display: `flex`, flexDirection: `column`, gap: `4px` }}
              >
                <div style={{ display: `flex`, gap: `4px` }}>
                  <button onClick={handleShowNameButtonClicked}>
                    名前を表示
                  </button>
                  {showName && <span>{usedCards.pickLatest()?.name}</span>}
                </div>
                <div style={{ display: `flex`, gap: `4px` }}>
                  <button onClick={handleShowHobbyButtonClicked}>
                    趣味を表示
                  </button>
                  {showHobby && <span>{usedCards.pickLatest()?.hobby}</span>}
                </div>
                <div style={{ display: `flex`, gap: `4px` }}>
                  <button onClick={handleShowAuthorButtonClicked}>
                    親を表示
                  </button>
                  {showAuthor && <span>{usedCards.pickLatest()?.author}</span>}
                </div>
              </div>
              <div
                style={{
                  width: `500px`,
                  height: `500px`,
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  position: `relative`,
                }}
              >
                <Image
                  src={`/images/${usedCards.pickLatest()?.imagePath}`}
                  alt={usedCards.pickLatest()?.imagePath}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
