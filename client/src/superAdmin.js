import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "./tools/axios";

export default function SuperAdmin({ mapVisible }) {
    const [userList, setUserList] = useState(null);
    const [confirm, setConfirm] = useState(false);
    useEffect(function () {
        mapVisible();
        axios
            .get("/get-all-users")
            .then(({ data }) => {
                console.log("data", data.data);
                setUserList(data.data);
            })
            .catch((err) => {
                console.log("err in axios get-all-users ", err);
            });
    }, []);

    const deleteUser = (e) => {
        console.log("id", e);
        axios
            .post("/delete-user", { id: e })
            .then(({ data }) => {
                setUserList(userList.filter((user) => user.id != e));
            })
            .catch((err) => {
                console.log("err in axios get-all-users ", err);
            });
    };

    const setAdmin = (e, boolean) => {
        console.log("id", e, boolean);
        for (var x = 0; x < userList.length; x++) {
            if (userList[x].id == e) {
                let newList = [...userList];
                newList[x].admin = !boolean;
                setUserList(newList);
            }
        }
        axios
            .post("/set-admin", { id: e, boolean: !boolean })
            .then(({ data }) => {
                console.log("done");
            })
            .catch((err) => {
                console.log("err in axios get-all-users ", err);
            });
    };

    const setSuperAdmin = (e, boolean) => {
        console.log("id", e, boolean);
        for (var x = 0; x < userList.length; x++) {
            if (userList[x].id == e) {
                let newList = [...userList];
                newList[x].super_admin = !boolean;
                setUserList(newList);
            }
        }
        axios
            .post("/set-super-admin", { id: e, boolean: !boolean })
            .then(({ data }) => {
                console.log("done");
            })
            .catch((err) => {
                console.log("err in axios get-all-users ", err);
            });
    };

    return (
        <div className="superAdminContainer">
            <div className="superList">
                {userList &&
                    userList.map((user) => {
                        var diff = new Date().getTimezoneOffset() / -60;

                        let msgDate = user.created_at.slice(0, 10).split("-");
                        var fixedDate =
                            msgDate[2] + "-" + msgDate[1] + "-" + msgDate[0];

                        let msgTime = user.created_at.slice(11, 19).split(":");

                        if (msgTime[0].startsWith("0")) {
                            msgTime[0] = msgTime[0].slice(1, 2);
                        }
                        var fixedTime =
                            JSON.parse(msgTime[0]) +
                            diff +
                            ":" +
                            msgTime[1] +
                            ":" +
                            msgTime[2];
                        return (
                            <div key={user.id} className="superListItem">
                                <img src={user.chat_img || "na.jpg"}></img>
                                <h1>{user.nickname}</h1>
                                <div>Last Online</div>
                                <span>{fixedDate}</span>
                                <span>{fixedTime}</span>
                                {user.admin && (
                                    <div
                                        id={user.id}
                                        className="adminYes"
                                        onClick={(e, boolean) =>
                                            setAdmin(e.target.id, user.admin)
                                        }
                                    >
                                        ADMIN
                                    </div>
                                )}
                                {!user.admin && (
                                    <div
                                        id={user.id}
                                        className="adminNo"
                                        onClick={(e, boolean) =>
                                            setAdmin(e.target.id, user.admin)
                                        }
                                    >
                                        ADMIN
                                    </div>
                                )}
                                {user.super_admin && (
                                    <div
                                        id={user.id}
                                        className="superAdminYes"
                                        onClick={(e, boolean) =>
                                            setSuperAdmin(
                                                e.target.id,
                                                user.super_admin
                                            )
                                        }
                                    >
                                        SUPER ADMIN
                                    </div>
                                )}
                                {!user.super_admin && (
                                    <div
                                        id={user.id}
                                        className="superAdminNo"
                                        onClick={(e, boolean) =>
                                            setSuperAdmin(
                                                e.target.id,
                                                user.super_admin
                                            )
                                        }
                                    >
                                        SUPER ADMIN
                                    </div>
                                )}
                                {confirm != user.id && (
                                    <div
                                        id={user.id}
                                        className="deleteUser"
                                        onClick={(e) => setConfirm(e.target.id)}
                                    >
                                        DELETE USER
                                    </div>
                                )}
                                {confirm == user.id && (
                                    <div
                                        className="deleteUserConfirm"
                                        id={user.id}
                                        onClick={(e) => deleteUser(e.target.id)}
                                    >
                                        CONFIRM
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
            <Link to="/" className="backLink" onClick={() => mapVisible()}>
                Back
            </Link>
        </div>
    );
}