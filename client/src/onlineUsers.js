import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect} from "react";

import useSound from "use-sound";

import chatSfx from "./../public/chat.mp3";

var count = 0;
export default function OnlineUsers() {

    const [play] = useSound(chatSfx);
    

    const onlineUsers = useSelector((state) => state && state.onlineUsers);

        // console.log("onlineUsers", onlineUsers);
        useEffect(() => {
         count  = onlineUsers.length;
          console.log("count", count);
        }, []);
        useEffect(() => {
            if (onlineUsers.length >= count) {
                play();
                count++
                console.log("count+", count);
            } else {
                count--
                console.log("count-", count);
            }
        }, [onlineUsers]);

    return (
        <>
            <div className="onlineUsers">
                {onlineUsers &&
                    onlineUsers.map((msg) => (
                        <p key={msg.id}>
                            <span>
                                {msg.nickname}
                            </span>
                            {msg.chat_msg}
                        </p>
                    ))}
            </div>
        </>
    );
}