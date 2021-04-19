import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect} from "react";

import useSound from "use-sound";

import chatSfx from "./../public/chat.mp3";

var count = 0;
export default function OnlineUsers({mute}) {
    // console.log("mute", mute)

    const [play] = useSound(chatSfx, { volume: 0.25 });
    

    const onlineUsers = useSelector((state) => state && state.onlineUsers);

        // console.log("onlineUsers", onlineUsers);
        useEffect(() => {
            if (onlineUsers) {
                count = onlineUsers.length;
                // console.log("count", count);
            }
        }, []);
        useEffect(() => {
            if (onlineUsers){
                if (onlineUsers.length >= count) {
                    if (!mute) {
                        play();
                    }
                    count++;
                    // console.log("count+", count);
                } else {
                    count--;
                    // console.log("count-", count);
                }
            }
        }, [onlineUsers]);

    return (
        <>
            <div className="onlineUsers">
                <Link to="/">
                    <div className="onlineUsersRedDot"></div>
                </Link>
                <div className="chatUserHeadline">Online</div>
                <div className="onlineUserCounter">{onlineUsers.length}</div>

                <div className="usersBack">
                    {onlineUsers &&
                        onlineUsers.map((msg) => (
                            <p key={msg.id}>
                                <span>{msg.nickname}</span>
                            </p>
                        ))}
                </div>
            </div>
        </>
    );
}
