import { useSelector } from "react-redux";
import { socket } from "./tools/socket";
import { useEffect, useState } from "react";
import axios from "./tools/axios";
import { Link } from "react-router-dom";

let emoji = require("./tools/customEmoj.json");

export default function OnlineUsers({
    chat_img,
    chat_myUserId,
    emojiBar,
    toggleEmojibar,
    sendEmoji,
    chat_color,
    setProfileImage,
    togglePrivateMSGS,
    openPrivate,
    privatePic,
    setPrivatePic,
    privateNick,
    setPrivateNick,
    privateMode,
    setPrivateMode,
    setFilteredPrivateMessages,
    privateMessages,
    guest,
    nickname,
    setNickname,
    setAdmin,
    onlineUsers,
    list,
    super_admin,
    configTimer,
    setConfigTimer,
    chatBan,
    horn,
    playNotification,
    shakeUser,
    setShakeUser,
}) {
    const [userPicBar, setUserPicBar] = useState(false);
    const [onlineUserPic, setOnlineUserPic] = useState("");
    const [file, setFile] = useState(null);
    const [closeTag, setcloseTag] = useState(false);
    const [chatColor, setChatColor] = useState(false);
    const [networkList, setNetworkList] = useState(false);
    const [networkUsers, setNetworkUsers] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [errorMsgInfo, setErrorMsgInfo] = useState(false);
    const [userConfig, setUserConfig] = useState(false);
    const [newNickname, setNewNickname] = useState(false);
    const [password, setPassword] = useState(false);
    const [pwdReveal, setPwdReveal] = useState(false);
    const [selectUserToKick, setSelectUserToKick] = useState(false);

    const statePrivateMsgs = useSelector((state) => state && state.messages);

    useEffect(() => {
        axios
            .get("/get-network-users")
            .then(({ data }) => {
                setNetworkUsers(data.data);
            })
            .catch((err) => {
                console.log("error", err);
            });

        if (!statePrivateMsgs) {
            axios

                .get("/filtered-private")
                .then(({ data }) => {
                    setFilteredPrivateMessages(data.data);
                    socket.emit("PRIVATE MESSAGES", data.data);
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }
        setNewNickname(nickname);
    }, []);

    useEffect(() => {
        if (horn) {
            setShakeUser(true);
            setSelectUserToKick(chat_myUserId);
        }
    }, [horn]);

    useEffect(() => {
        if (shakeUser) {
            const timer = setTimeout(() => {
                setShakeUser(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [shakeUser]);

    useEffect(() => {
        axios
            .get("/filtered-private")
            .then(({ data }) => {
                setFilteredPrivateMessages(data.data);
            })
            .catch((err) => {
                console.log("error", err);
            });

        if (
            statePrivateMsgs &&
            statePrivateMsgs.length - 1 >= 0 &&
            !statePrivateMsgs[statePrivateMsgs.length - 1].receiver_seen &&
            statePrivateMsgs[statePrivateMsgs.length - 1].msg_receiver_id ==
                chat_myUserId
        ) {
            playNotification();
        }
    }, [statePrivateMsgs]);

    useEffect(() => {
        if (onlineUsers) {
            let users = onlineUsers;

            users.forEach((element) => {
                if (element.id == chat_myUserId) {
                    element.online = true;
                    socket.emit("ONLINE USERS", users);
                    axios
                        .post("/set-user-status", { online: true })
                        .then(({ data }) => {})
                        .catch((err) => {
                            console.log("error", err);
                        });
                }
            });
        }
    }, []);

    const keyCheck = (e, id) => {
        if (e.key === "Enter") {
            if (e.target.value !== "") {
                e.preventDefault();
                setConfigTimer(false);
                socket.emit("forceDisconnect", id);
            }
        }
    };

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
                    setFile(null);
                    let updatedUsers = onlineUsers;
                    updatedUsers.forEach((user) => {
                        if (user.id == chat_myUserId) {
                            user.chat_img = data.data[0].chat_img;
                        }
                    });
                    socket.emit("ONLINE USERS", updatedUsers);
                } else {
                    setErrorMsg(true);
                }
            })
            .catch((err) => {
                console.log("error", err);
                setErrorMsg(true);
            });
    };

    const handleColorChange = (e) => {
        setChatColor(e.target.value);
        axios
            .post("/changeColor", e.target.value)
            .then(({ data }) => {
                let updatedColorUsers = onlineUsers;
                updatedColorUsers.forEach((user) => {
                    if (user.id == chat_myUserId) {
                        user.chat_color = data.data.chat_color;
                    }
                    socket.emit("ONLINE USERS", updatedColorUsers);
                });
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    const toggleUploader = () => {
        setUserPicBar(!userPicBar);
        setcloseTag(!closeTag);
        toggleEmojibar(false);
        setUserConfig(!userConfig);
    };

    const changeInfo = (ev1, ev2) => {
        axios
            .post("/change-nickname", { nickname: ev1 })
            .then(({ data }) => {
                if (data) {
                    setUserConfig(false);
                } else {
                    setErrorMsg(true);
                }
            })
            .catch((err) => {
                console.log("error", err);
                setErrorMsg(true);
            });

        if (ev2) {
            axios
                .post("/change-password", { password: ev2 })
                .then(({ data }) => {
                    if (data) {
                        setUserConfig(false);
                    } else {
                        setErrorMsg(true);
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                    setErrorMsg(true);
                });
        }
    };

    return (
        <>
            {!chatBan && (
                <div
                    className="onlineUsersBack"
                    style={{
                        marginBottom:
                            (emojiBar && `-5vmax`) || (privateMode && `-2vmax`),
                        marginLeft: privateMode && `1vmax`,
                    }}
                >
                    <div
                        className="onlineUsers"
                        id={(list && "onlineUsersDark") || ""}
                        style={{
                            boxShadow:
                                privateMode &&
                                `-0 0 10px rgba(0, 0, 0, 0.308), 0 -0 10px rgba(0, 0, 0, 0.308),
        -0 -0 10px rgba(0, 0, 0, 0.308), -0 -0 10px rgba(0, 0, 0, 0.308)`,
                        }}
                    >
                        {privateMode && (
                            <div
                                className="buttonBack"
                                style={{
                                    marginBottom: `-1vmax`,
                                    color: `white`,
                                    zIndex: `325423`,
                                }}
                                onClick={(e) => {
                                    setPrivateMode(false);
                                    toggleEmojibar(false);
                                    axios
                                        .get("/filtered-private")
                                        .then(({ data }) => {
                                            setFilteredPrivateMessages(
                                                data.data
                                            );
                                        })
                                        .catch((err) => {
                                            console.log("error", err);
                                        });
                                }}
                            >
                                X
                            </div>
                        )}
                        {!userPicBar &&
                            !privateMode &&
                            !userConfig &&
                            !networkList && (
                                <Link to="/">
                                    {" "}
                                    <div
                                        className="onlineUsersRedDot"
                                        title="Main Page"
                                    ></div>
                                </Link>
                            )}
                        {!userPicBar &&
                            !privateMode &&
                            networkList &&
                            !userConfig && (
                                <div
                                    className="onlineUsersRedDot"
                                    title="Online List"
                                    onClick={(e) => {
                                        toggleEmojibar(false);
                                        setNetworkList(false);
                                    }}
                                ></div>
                            )}
                        {!userPicBar && !privateMode && userConfig && (
                            <div
                                className="onlineUsersRedDot"
                                title="Back"
                                onClick={(e) => {
                                    toggleEmojibar(false);

                                    setUserConfig(false);
                                    setConfigTimer(false);
                                }}
                            ></div>
                        )}
                        {!userPicBar && !userConfig && (
                            <div className="mobileOnlineUsers">
                                {!privateMode && (
                                    <div className="chatUserHeadline">
                                        {!networkList && "Online"}
                                    </div>
                                )}

                                {!privateMode && networkList && (
                                    <div
                                        className="chatUserHeadline"
                                        id="chatUserHeadline"
                                    >
                                        Network
                                    </div>
                                )}
                                {!privateMode && (
                                    <span className="onlineUserCounter">
                                        {!networkList &&
                                            onlineUsers &&
                                            onlineUsers.length}
                                        {networkList &&
                                            networkUsers.filter(
                                                (user) =>
                                                    !user.nickname.includes(
                                                        "Guest"
                                                    )
                                            ).length}
                                    </span>
                                )}
                                <div
                                    className="usersBack"
                                    id={(list && "usersBackDark") || ""}
                                    style={{
                                        marginTop: privateMode && `-0.2vmax`,
                                        boxShadow: privateMode && `none`,
                                        border: privateMode && `none`,
                                        backgroundColor:
                                            !privateMode &&
                                            `rgba(255, 255, 255, 0.027)`,
                                    }}
                                >
                                    {!privateMode &&
                                        networkList &&
                                        networkUsers.map((user) => (
                                            <div key={user.id}>
                                                {!user.nickname.includes(
                                                    "Guest"
                                                ) && (
                                                    <div>
                                                        <div
                                                            className="onlineList"
                                                            onClick={(e) => {
                                                                if (
                                                                    user.id !=
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
                                                        >
                                                            <div id="networkUser">
                                                                <img
                                                                    className="onlineListImg"
                                                                    alt={
                                                                        user.nickname
                                                                    }
                                                                    src={
                                                                        (chat_myUserId ==
                                                                            user.id &&
                                                                            onlineUserPic) ||
                                                                        (user.chat_img &&
                                                                            user.chat_img) ||
                                                                        "./../avatar.png"
                                                                    }
                                                                ></img>
                                                            </div>
                                                            <span
                                                                title={
                                                                    user.id !=
                                                                        chat_myUserId &&
                                                                    "Send Private Message"
                                                                }
                                                                style={{
                                                                    color:
                                                                        (chat_myUserId ==
                                                                            user.id &&
                                                                            chatColor) ||
                                                                        user.chat_color ||
                                                                        `yellow`,
                                                                }}
                                                            >
                                                                {user.nickname}
                                                            </span>
                                                            {privateMessages &&
                                                                privateMessages.map(
                                                                    (msg) => {
                                                                        if (
                                                                            !msg.receiver_seen &&
                                                                            msg.msg_sender_id ==
                                                                                user.id
                                                                        ) {
                                                                            return (
                                                                                <div
                                                                                    className="notification"
                                                                                    key={
                                                                                        msg.id
                                                                                    }
                                                                                ></div>
                                                                            );
                                                                        }
                                                                    }
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                    {onlineUsers &&
                                        !networkList &&
                                        !privateMode &&
                                        onlineUsers.map((user) => (
                                            <div key={user.id}>
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            horn &&
                                                            horn.admin_shaked ==
                                                                user.id &&
                                                            `#fbff0413`,
                                                    }}
                                                    className="onlineList"
                                                    id={
                                                        (shakeUser &&
                                                            user.id ==
                                                                selectUserToKick &&
                                                            "hornShake") ||
                                                        ""
                                                    }
                                                >
                                                    <div
                                                        className="onlineListDetails"
                                                        onClick={(e) => {
                                                            if (
                                                                user.id !=
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
                                                    >
                                                        <div
                                                            id={
                                                                (user.online &&
                                                                    "online") ||
                                                                (!user.online &&
                                                                    "offline")
                                                            }
                                                        >
                                                            <img
                                                                className="onlineListImg"
                                                                alt={
                                                                    user.nickname
                                                                }
                                                                src={
                                                                    (chat_myUserId ==
                                                                        user.id &&
                                                                        onlineUserPic) ||
                                                                    (user.chat_img &&
                                                                        user.chat_img) ||
                                                                    "./../avatar.png"
                                                                }
                                                            ></img>
                                                        </div>
                                                        {user.super_admin && (
                                                            <div id="OnlineListImg"></div>
                                                        )}
                                                        <span
                                                            title={
                                                                user.id !=
                                                                    chat_myUserId &&
                                                                "Send Private Message"
                                                            }
                                                            style={{
                                                                color:
                                                                    (chat_myUserId ==
                                                                        user.id &&
                                                                        chatColor) ||
                                                                    user.chat_color ||
                                                                    `lime`,
                                                            }}
                                                        >
                                                            {(user.id ==
                                                                chat_myUserId &&
                                                                nickname) ||
                                                                user.nickname}
                                                        </span>

                                                        {privateMessages &&
                                                            privateMessages.map(
                                                                (msg) => {
                                                                    if (
                                                                        !msg.receiver_seen &&
                                                                        msg.msg_sender_id ==
                                                                            user.id
                                                                    ) {
                                                                        return (
                                                                            <div
                                                                                className="notification"
                                                                                key={
                                                                                    msg.id
                                                                                }
                                                                            ></div>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                    </div>
                                                    {configTimer &&
                                                        selectUserToKick ==
                                                            user.id && (
                                                            <div className="timerConfig">
                                                                <div id="timerConfigBox">
                                                                    <div>
                                                                        BAN TIME
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        onKeyDown={(
                                                                            e
                                                                        ) =>
                                                                            keyCheck(
                                                                                e,
                                                                                user.id
                                                                            )
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            socket.emit(
                                                                                "BAN TIMER",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    ></input>
                                                                </div>

                                                                <div
                                                                    className="kickOut"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        setConfigTimer(
                                                                            false
                                                                        );
                                                                        if (
                                                                            user.id !=
                                                                            chat_myUserId
                                                                        ) {
                                                                            socket.emit(
                                                                                "forceDisconnect",
                                                                                user.id
                                                                            );
                                                                        }
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                    {user.id != chat_myUserId &&
                                                        !configTimer &&
                                                        super_admin && (
                                                            <div
                                                                className="kickOut"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    setConfigTimer(
                                                                        true
                                                                    );
                                                                    setSelectUserToKick(
                                                                        user.id
                                                                    );
                                                                }}
                                                            ></div>
                                                        )}
                                                    {user.id !=
                                                        chat_myUserId && (
                                                        <div
                                                            className="horn"
                                                            onClick={(e) => {
                                                                setSelectUserToKick(
                                                                    user.id
                                                                );
                                                                setShakeUser(
                                                                    true
                                                                );
                                                                socket.emit(
                                                                    "HORN",
                                                                    {
                                                                        user: user.id,
                                                                        horn: true,
                                                                        admin_shaked:
                                                                            chat_myUserId,
                                                                    }
                                                                );
                                                            }}
                                                        ></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                    {privateMode && (
                                        <div>
                                            <img
                                                src={
                                                    privatePic ||
                                                    "./../avatar.png"
                                                }
                                                id="privateUserImage"
                                            ></img>
                                        </div>
                                    )}
                                </div>
                                {privateMode && (
                                    <div id="privateMsgUserNick">
                                        {privateNick}
                                    </div>
                                )}
                            </div>
                        )}

                        {userConfig && (
                            <div className="changeNickBox">
                                <div className="changeNickInstructions">
                                    Edit User
                                </div>
                                <div className="changeNickBoxThread">
                                    Nickname
                                </div>
                                <input
                                    type="text"
                                    placeholder="nickname"
                                    defaultValue={nickname}
                                    onChange={(e) =>
                                        setNewNickname(e.target.value)
                                    }
                                    onClick={(e) => {
                                        setErrorMsgInfo(false);
                                    }}
                                ></input>
                                <div className="changeNickBoxThread">
                                    Password
                                </div>
                                <div className="userConfigPwdBack">
                                    <input
                                        type={
                                            (!pwdReveal && "password") ||
                                            (pwdReveal && "text")
                                        }
                                        placeholder="password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    ></input>
                                    <div
                                        className={
                                            (pwdReveal && "pwdNOTvisible") ||
                                            (!pwdReveal && "pwdVisibility")
                                        }
                                        onClick={(e) => {
                                            setPwdReveal(!pwdReveal);
                                        }}
                                    ></div>
                                </div>
                                <div
                                    className="changeNickButton"
                                    onClick={(e) => {
                                        if (!newNickname.includes("Guest")) {
                                            setAdmin(true);
                                        }
                                        if (newNickname != "") {
                                            changeInfo(newNickname, password);
                                            setNickname(newNickname);
                                        } else {
                                            setErrorMsgInfo(true);
                                        }
                                        let updatedNickUsers = onlineUsers;
                                        updatedNickUsers.forEach((user) => {
                                            if (user.id == chat_myUserId) {
                                                user.nickname = newNickname;
                                            }
                                        });

                                        socket.emit(
                                            "ONLINE USERS",
                                            updatedNickUsers
                                        );
                                    }}
                                >
                                    Confirm
                                </div>
                                {errorMsgInfo && (
                                    <p className="error" id="error">
                                        Please Enter A Proper Nickname
                                    </p>
                                )}
                            </div>
                        )}

                        {userPicBar && (
                            <div className="fileUploaderChat">
                                <img
                                    src={chat_img || "./../avatar.png"}
                                    id="privateUserImage"
                                ></img>
                                <h1>Chat Image</h1>

                                <input
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={(e) => handleUploaderChange(e)}
                                    onClick={(e) => setErrorMsg(false)}
                                />

                                <div className="uploadChat">
                                    <h1 onClick={() => handleUploaderClick()}>
                                        UPDATE
                                    </h1>
                                    {closeTag && (
                                        <h1
                                            className="toggleChatUploader"
                                            onClick={() => {
                                                setErrorMsg(false);
                                                toggleUploader();
                                            }}
                                        >
                                            CLOSE
                                        </h1>
                                    )}
                                </div>
                                {errorMsg && (
                                    <p className="error" id="error">
                                        Select an Image [Max Size: 2MB]
                                    </p>
                                )}
                            </div>
                        )}
                        {!closeTag && !privateMode && (
                            <div className="chatMenuOptions">
                                <div
                                    className="chatMenuConfigButton"
                                    title={
                                        (!userConfig && "Edit Account") ||
                                        "Close"
                                    }
                                    onClick={(e) => {
                                        setUserConfig(!userConfig);
                                        toggleEmojibar(false);
                                        setErrorMsgInfo(false);
                                        setConfigTimer(false);
                                    }}
                                ></div>
                                {!guest && !userConfig && (
                                    <div
                                        title="User Network"
                                        className="networkList"
                                        onClick={() => {
                                            setNetworkList(!networkList);
                                            setConfigTimer(false);
                                        }}
                                    ></div>
                                )}

                                {userConfig && (
                                    <img
                                        className="uploaderTogglerImg"
                                        onClick={() => {
                                            toggleUploader();
                                            setErrorMsgInfo(false);
                                            setConfigTimer(false);
                                        }}
                                    ></img>
                                )}
                                {!userConfig && (
                                    <input
                                        className="colorSelector"
                                        title="Change Chat Color"
                                        type="color"
                                        defaultValue={
                                            chatColor || chat_color || `#00f01c`
                                        }
                                        style={{
                                            boxShadow:
                                                chatColor &&
                                                `-0 0 10px ${chatColor}, 0 -0 10px ${chatColor},
        -0 -0 10px ${chatColor}, -0 -0 10px ${chatColor}`,
                                        }}
                                        onChange={(e) => {
                                            handleColorChange(e);
                                        }}
                                    ></input>
                                )}
                            </div>
                        )}
                    </div>
                    {emojiBar && (
                        <div className="emoticons" id={list && "emoticonsDark"}>
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
            )}
        </>
    );
}
