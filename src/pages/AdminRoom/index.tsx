import { useHistory, useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Remove } from "../../components/Icons/Remove";
import { Question } from "../../components/Question";

import logoImg from "../../assets/images/logo.svg";

import "../Room/room.scss";

interface RoomParams {
  id: string;
}

export function AdminRoom() {
  const history = useHistory();
  const { id: roomId } = useParams<RoomParams>();

  const { title, questions } = useRoom(roomId);

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Deseja realmente excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div className="buttons">
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>
              Encerrar sala
            </Button>
          </div>
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

        <div className="question-list">
          {questions.map(({ id, author, content }) => (
            <Question key={id} author={author} content={content}>
              <button type="button" onClick={() => handleDeleteQuestion(id)}>
                <Remove />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
