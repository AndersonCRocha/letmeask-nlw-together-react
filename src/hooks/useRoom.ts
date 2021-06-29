import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

interface IQuestion {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string;
  isAnswered: boolean,
  isHighlighted: boolean,
  likesCount: number,
  likeId?: string,
}

interface FirebaseQuestions extends Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string;
  isAnswered: boolean,
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>{}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [isClosed, setIsClosed] = useState(false)
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<IQuestion[]>([])

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, { author, content, isAnswered, isHighlighted, likes }]) => ({
          id: key,
          author,
          content,
          isAnswered,
          isHighlighted,
          likesCount: Object.values(likes ?? {}).length,
          likeId: Object.entries(likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        })
      );

      const sortedQuestions = parsedQuestions.sort((a: IQuestion, b: IQuestion) => {
        return (a.isHighlighted && !b.isHighlighted) 
          ? -1
          : 1
      })

      setIsClosed(!!databaseRoom.closedAt)
      setTitle(databaseRoom.title);
      setQuestions(sortedQuestions);
    });

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id]);

  return {
    isClosed,
    title, 
    questions
  }
}