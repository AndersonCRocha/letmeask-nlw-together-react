import { FormEvent, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { useRoom } from "../../hooks/useRoom";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { UserInfo } from "../../components/UserInfo";
import { Like } from "../../components/Icons";

import logoImg from "../../assets/images/logo.svg";

import "./room.scss";

interface RoomParams {
  id: string;
}

export function Room() {
  const history = useHistory();
  const { user } = useAuth();
  const { id: roomId } = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");

  const { isClosed, title, questions } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") return;

    if (!user) throw new Error("Unauthenticated user");

    const question = {
      isHighlighted: false,
      isAnswered: false,
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
    };

    setNewQuestion("");

    await database.ref(`rooms/${roomId}/questions`).push(question);
  }

  async function handleLikeQuestion(questionId?: string, likeId?: string) {
    if (!questionId) return;

    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  if (isClosed) {
    history.push("/");
    alert(`A sala '${title}' foi fechada pelo autor!`);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length} pergunta{questions.length > 1 && "s"}
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <UserInfo user={user} />
            ) : (
              <span>
                Para enviar uma pergunta <button>faça seu login</button>
              </span>
            )}

            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map(
            ({
              id,
              author,
              content,
              likeId,
              likesCount,
              isAnswered,
              isHighlighted,
            }) => (
              <Question
                key={id}
                author={author}
                content={content}
                isAnswered={isAnswered}
                isHighlighted={isHighlighted}
              >
                {!isAnswered && (
                  <button
                    type="button"
                    className={`like-button ${likeId ? "liked" : ""}`}
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(id, likeId)}
                  >
                    <span>{likesCount}</span>
                    <Like />
                  </button>
                )}
              </Question>
            )
          )}
        </div>
      </main>
    </div>
  );
}
