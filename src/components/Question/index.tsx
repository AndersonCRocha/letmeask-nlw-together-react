import { ReactNode } from "react";
import classes from "classnames";

import { UserInfo } from "../UserInfo/";

import "./styles.scss";

interface QuestionProps {
  children: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted?: boolean;
  isAnswered?: boolean;
}

export function Question({
  content,
  author,
  children,
  isHighlighted = false,
  isAnswered = false,
}: QuestionProps) {
  return (
    <div
      className={classes("question", {
        highlighted: isHighlighted && !isAnswered,
        answered: isAnswered,
      })}
    >
      <p>{content}</p>
      <footer>
        <UserInfo user={{ ...author }} />

        <div className="actions">{children}</div>
      </footer>
    </div>
  );
}
