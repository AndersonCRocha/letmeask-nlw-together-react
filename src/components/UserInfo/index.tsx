import "./styles.scss";

interface UserInfoProps {
  user: {
    avatar: string;
    name: string;
  };
}

export function UserInfo({ user: { avatar, name } }: UserInfoProps) {
  return (
    <div className="user-info">
      <img src={avatar} alt={`${name} avatar`} />
      <span>{name}</span>
    </div>
  );
}
