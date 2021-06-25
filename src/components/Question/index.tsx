import { ReactNode } from "react";
import { UserInfo } from "../UserInfo/";

import "./styles.scss";

interface QuestionProps {
  children: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}

export function Question({ content, author, children }: QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <UserInfo user={{ ...author }} />

        <div className="actions">{children}</div>
      </footer>
    </div>
  );
}
