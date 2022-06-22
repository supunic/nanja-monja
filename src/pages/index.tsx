import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { createUser, initDeck, initUsedCards, initUsers } from '@/useCase';
import { imagePaths } from '@/const';
import { Deck } from '@/domain/card/deck';
import { UsedCards } from '@/domain/card/usedCards';
import { Users } from '@/domain/user/users';
import { pose } from '@/util';
import { UserRepository } from '@/infrastructure/firebase/repository/user';
import { MyFirebase } from '@/vender/firebase';

type HomeProps = {
  fetchUsers: Users;
};

export default function Home({ fetchUsers }: HomeProps) {
  const firebase = new MyFirebase();
  const userRepository = new UserRepository(firebase.db);

  const [deck, setDeck] = useState<Deck>(initDeck(imagePaths));
  const [usedCards, setUsedCards] = useState<UsedCards>(initUsedCards());
  const [users, setUsers] = useState<Users>(initUsers(fetchUsers));
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

      const name = prompt(`名前をつけてください`) || ``;
      const hobby = prompt(`趣味を決めてください`) || ``;
      const author = prompt(`親を入れてください`) || ``;

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

  const handleJoinUserButtonClicked = async () => {
    const name = prompt(`ユーザー名を入力してください`) || `名無し`;

    const id = users.newId();
    const newUser = createUser(id, name);
    // const newUsers = users.join(newUser);

    await userRepository.set(newUser);

    // setUsers(newUsers);
  };

  const handleExitUserButtonClicked: MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    const id = e.currentTarget.dataset.id;

    if (!id) return;

    const user = users.findById(id);

    if (!user) return;

    const newUsers = users.exit(user);

    setUsers(newUsers);
  };

  const handleAddPointButtonClicked: MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    const id = e.currentTarget.dataset.id;

    if (!id) return;

    const point = Number(e.currentTarget.dataset.point);

    if (!point) return;

    const user = users.findById(id);

    if (!user) return;

    const newUser = user.addPoint(point);
    const newUsers = users.updateUser(newUser);

    setUsers(newUsers);
  };

  const handleSubPointButtonClicked: MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    const id = e.currentTarget.dataset.id;

    if (!id) return;

    const point = 1;
    const user = users.findById(id);

    if (!user) return;

    const newUser = user.subPoint(point);
    const newUsers = users.updateUser(newUser);

    setUsers(newUsers);
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
      <div
        style={{
          display: `flex`,
          gap: `80px`,
          justifyContent: `space-between`,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: `flex`, gap: `4px` }}>
            <button onClick={handleDrawButtonClicked}>ドロー</button>
            <button onClick={handleShuffleButtonClicked}>シャッフル</button>
            <button onClick={handleJoinUserButtonClicked}>参加者追加</button>
            {deck.count() === 0 && (
              <button onClick={handleResetButtonClicked}>リセット</button>
            )}
          </div>
          <div>
            <p>参加者：{users.count()}人</p>
            <ul
              style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}
            >
              {users.users.map((user) => {
                return (
                  <li key={user.id} style={{ display: `flex`, gap: `12px` }}>
                    <span>{user.name}</span>
                    <span>{user.point}ポイント</span>
                    <button
                      data-id={user.id}
                      data-point={1}
                      onClick={handleAddPointButtonClicked}
                    >
                      名前正解
                    </button>
                    <button
                      data-id={user.id}
                      data-point={2}
                      onClick={handleAddPointButtonClicked}
                    >
                      趣味正解
                    </button>
                    <button
                      data-id={user.id}
                      onClick={handleSubPointButtonClicked}
                    >
                      ポイント下げる
                    </button>
                    <button
                      data-id={user.id}
                      onClick={handleExitUserButtonClicked}
                    >
                      離脱
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p>山札：{deck.count()}枚</p>
          </div>
          <div>
            <p>場：{usedCards.count()}枚</p>
            <div>
              {usedCards.pickLatest() && (
                <div
                  style={{
                    display: `flex`,
                    flexDirection: `column`,
                    gap: `8px`,
                  }}
                >
                  <div
                    style={{
                      display: `flex`,
                      flexDirection: `column`,
                      gap: `4px`,
                    }}
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
                      {showHobby && (
                        <span>{usedCards.pickLatest()?.hobby}</span>
                      )}
                    </div>
                    <div style={{ display: `flex`, gap: `4px` }}>
                      <button onClick={handleShowAuthorButtonClicked}>
                        親を表示
                      </button>
                      {showAuthor && (
                        <span>{usedCards.pickLatest()?.author}</span>
                      )}
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
        <div>
          <h3>ルール</h3>
          <p>1. 参加者を追加</p>
          <p>2. 人数が揃ったら順番を決めてドロー</p>
          <p>3. はじめてのキャラを引いたら名前・趣味・親を入力</p>
          <p>4. 名前をつけたキャラを引いたら名前と趣味をあてる</p>
          <p>5. 名前1点、趣味2点でカウント</p>
        </div>
      </div>
    </div>
  );
}

Home.getInitialProps = async () => {
  const firebase = new MyFirebase();
  const userRepository = new UserRepository(firebase.db);
  const fetchUsers = await userRepository.fetchAll();

  return { userRepository, fetchUsers };
};
