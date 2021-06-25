import copyImg from "../../assets/images/copy.svg";

import "../../styles/room-code.scss";

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
  function handleCopyRoomCode() {
    navigator.clipboard.writeText(code);
  }

  return (
    <button className="room-code" onClick={handleCopyRoomCode}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>

      <span>Sala #{code}</span>
    </button>
  );
}
