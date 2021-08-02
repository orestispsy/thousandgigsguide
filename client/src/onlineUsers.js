import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./tools/axios";
import useSound from "use-sound";

import chatSfx from "./../public/chat.mp3";

let emoji = require("./tools/customEmoj.json");

var count = 0;
export default function OnlineUsers({
    mute,
    chat_img,
    chat_myUserId,
    emojiBar,
    toggleEmojibar,
    sendEmoji,
    chat_color,
    setProfileImage,
    togglePrivateMSGS,
    openPrivate,
    setPrivatePic,
    privateNick,
    setPrivateNick,
    setPrivateMode,
    privateMode,
    userPrivate,
    privatePic,
}) {
    if (chat_img) {
        chat_img = "";
    }
    const [userPicBar, setUserPicBar] = useState(false);
    const [onlineUserPic, setOnlineUserPic] = useState(chat_img);
    const [file, setFile] = useState(null);
    const [closeTag, setcloseTag] = useState(false);
    const [chatColor, setChatColor] = useState(false);

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
        if (onlineUsers) {
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

    const handleUploaderChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploaderClick = () => {
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post("/addChatPic", formData)
            .then(({ data }) => {
                if (data.data[0]) {
                    setOnlineUserPic(data.data[0].chat_img);
                    setUserPicBar(!userPicBar);
                    setcloseTag(!closeTag);
                    setProfileImage(data.data[0].chat_img);
                } else {
                    console.log("data fail");
                }
            })
            .catch((err) => {
                console.log("error", err);
                // console.log("err in axios in Image Uploader ", err);
            });
    };

    const handleColorChange = (e) => {
        axios
            .post("/changeColor", e.target.value)
            .then(({ data }) => {
                setChatColor(data.data.chat_color);
            })
            .catch((err) => {
                //   console.log("error", err);
            });
    };

    const toggleUploader = () => {
        setUserPicBar(!userPicBar);
        setcloseTag(!closeTag);
    };

    return (
        <>
            <div className="onlineUsersBack">
                <div className="onlineUsers">
                    {!userPicBar && !emojiBar && !privateMode && (
                        <Link to="/">
                            <div
                                className="onlineUsersRedDot"
                                title="Back"
                            ></div>
                        </Link>
                    )}

                    {privateMode && (
                        <div
                            className="onlineUsersRedDot"
                            title="Back"
                            onClick={() => setPrivateMode(false)}
                        ></div>
                    )}
                    {!userPicBar && (
                        <div className="mobileOnlineUsers">
                            {!privateMode && (
                                <div className="chatUserHeadline">Online</div>
                            )}
                            {!privateMode && (
                                <span className="onlineUserCounter">
                                    {onlineUsers && onlineUsers.length}
                                </span>
                            )}
                            <div className="usersBack">
                                {onlineUsers &&
                                    !privateMode &&
                                    onlineUsers.map((user) => (
                                        <div key={user.id}>
                                            <div
                                                className="onlineList"
                                                key={user.id}
                                            >
                                                <img
                                                    id={user.id}
                                                    className="onlineListImg"
                                                    alt={user.nickname}
                                                    src={
                                                        (chat_myUserId ==
                                                            user.id &&
                                                            onlineUserPic) ||
                                                        (user.chat_img &&
                                                            user.chat_img) ||
                                                        "./../avatar.png"
                                                    }
                                                    onClick={(e) => {
                                                        if (
                                                            e.target.id !=
                                                            chat_myUserId
                                                        ) {
                                                            toggleEmojibar(
                                                                false
                                                            );
                                                            togglePrivateMSGS();
                                                            openPrivate(
                                                                user.id
                                                            );
                                                            setPrivatePic(
                                                                user.chat_img
                                                            );
                                                            setPrivateNick(
                                                                user.nickname
                                                            );
                                                        }
                                                    }}
                                                ></img>

                                                <span
                                                    style={{
                                                        color:
                                                            (chat_myUserId ==
                                                                user.id &&
                                                                chatColor) ||
                                                            user.chat_color ||
                                                            `lime`,
                                                    }}
                                                >
                                                    {user.nickname}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                {privateMode && (
                                    <div>
                                        <img
                                            src={
                                                privatePic || "./../avatar.png"
                                            }
                                            id="privateUserImage"
                                            onClick={() =>
                                                setPrivateMode(false)
                                            }
                                        ></img>
                                    </div>
                                )}
                            </div>
                            {privateMode && (
                                <div id="privateMsgUserNick">{privateNick}</div>
                            )}
                        </div>
                    )}

                    {userPicBar && (
                        <div className="fileUploaderChat">
                            <h1>Select Image</h1>
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={(e) => handleUploaderChange(e)}
                            />

                            <div
                                className="uploadChat"
                                onClick={() => handleUploaderClick()}
                            >
                                <h1>UPDATE</h1>
                                {closeTag && (
                                    <h1
                                        className="toggleChatUploader"
                                        onClick={() => toggleUploader()}
                                    >
                                        CLOSE
                                    </h1>
                                )}
                            </div>
                        </div>
                    )}
                    {!closeTag && !privateMode && (
                        <div className="chatMenuOptions">
                            <img
                                className="uploaderTogglerImg"
                                onClick={() => toggleUploader()}
                            ></img>

                            <input
                                className="colorSelector"
                                title="Change Chat Color"
                                type="color"
                                defaultValue={chat_color || `#00f01c`}
                                onChange={(e) => handleColorChange(e)}
                            ></input>
                        </div>
                    )}
                </div>
                {emojiBar && (
                    <div className="emoticons">
                        {emoji &&
                            emoji.map((emoj) => (
                                <div key={emoj.id}>
                                    <img
                                        src={emoj.url}
                                        onClick={(e) => sendEmoji(e)}
                                    ></img>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}
