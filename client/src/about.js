import React, { useState, useEffect,  Fragment } from "react";
import axios from "./tools/axios";
import { Link } from "react-router-dom";

export default function About({ setAboutMode, aboutMode, super_admin }) {
    const [imgCount, setImgCount] = useState(Math.floor(((Math.random() * 8) +2 )));
    const [userName, setUserName] = useState(false);
    const [email, setEmail] = useState(false);
    const [website, setWebsite] = useState("");
    const [comment, setComment] = useState(false);
    const [replyText, setReplyText] = useState(false);
    const [commentSection, setCommentSection] = useState(true);
    const [blogComments, setBlogComments] = useState(false);
    const [reply, setReply] = useState(false);
    const [selectedComment, setSelectedComment] = useState(false);

    useEffect(function () {
        setAboutMode(true);
        getAboutComments();
    }, []);


    const getAboutComments = (e) => {
        axios
            .get("/get-about-comments/")
            .then(({ data }) => {
                setBlogComments(data.rows);
           
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteAboutComment = (e) => {
        axios
            .post("/delete-about-comment/", {
                id: e,
            })
            .then(({ data }) => {
               getAboutComments();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const sendComment = (e) => {
        if (comment && userName && email) {
            axios
                .post("/add-about-comment/", {
                    comment: comment,
                    userName: userName,
                    email: email,
                    website: website,

                    reply: 0,
                })
                .then(({ data }) => {
                    setCommentSection(true);
                    getAboutComments();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (replyText && userName && email) {
            axios
                .post("/add-about-comment/", {
                    comment: replyText,
                    userName: userName,
                    email: email,
                    website: website,
                    reply: selectedComment,
                })
                .then(({ data }) => {
                    setReply(false);
                    getAboutComments();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <div
            className="aboutContainer"
            onClick={(e) => {
                if (imgCount < 9) {
                    setImgCount(imgCount + 1);
                } else {
                    setImgCount(2);
                }
            }}
        >
            <div className="aboutDescription">
                <Link
                    to="/"
                    className="buttonBack"
                    id="aboutClose"
                    title="Back"
                    onClick={(e) => {
                        setAboutMode(false);
                    }}
                >
                    X
                </Link>

                <a target="_blank" href="https://www.1000mods.com">
                    <div className="logo2About"></div>
                </a>

                <div className="logo2AboutDesc"> The Gig Guide</div>

                <div className="aboutBack">
                    <div className="about"> About</div>
                    <div className="authWrapper">
                        <div className="aboutText">
                            <div>
                                Friend, fan and brother soul of The Almighty{" "}
                                <a
                                    href="https://www.1000mods.com"
                                    target="_blank"
                                >
                                    1000mods
                                </a>
                                . We met back in the early daze, when the
                                universe joined lines and brought things
                                together.
                            </div>
                            <div>
                                Some years ago I asked them if there is a
                                concert archive for all these years on stage.
                                The answer was: " Yes, the first 500 are stored
                                in documents or hand-written in lists. As for
                                the rest, nowadays they can be found ! ".
                            </div>
                            <div>
                                Lately, after summoning some super-tech-powers
                                up, I started building an "archive" website for
                                1000mods, their fans and all these nights of
                                sweat on stage and the floor.
                            </div>
                            <div>
                                The "Thousand Gigs Guide" is a tool for the band
                                to create, manage and maintain their own concert
                                history. On the same time, it is an online band
                                concert agenda for fans , to get the past &
                                future band's Touring Info, contribute in it and
                                interact with each other.
                            </div>
                        </div>
                    </div>
                    <div className="author"> The Author</div>
                    <div className="authWrapper">
                        <div className="authPic"></div>
                        <div className="authorText">
                            <div>
                                Full-Stack Web Developer, Electronic Engineer,
                                Musician, Web-Radio Broadcaster, Story Teller
                                from Outer Space.
                            </div>

                            <div>
                                Can be found hitch-hiking the Super Van when on
                                tour, letting the dates decide for the day back
                                home...
                            </div>
                        </div>
                    </div>
                    <div className="author">
                        {(!commentSection && "Share Your Thoughts") ||
                            "Comments"}
                    </div>
                    {!commentSection && (
                        <div
                            className="sendAboutCommentClose"
                            onClick={(e) => {
                                setCommentSection(!commentSection);
                            }}
                        >
                            X
                        </div>
                    )}
                    {commentSection && (
                        <div className="saySomethingBack" id="saySomethingBack">
                            {blogComments &&
                                blogComments.map((blogEntry) => {
                                    return (
                                        <React.Fragment key={blogEntry.id}>
                                            {blogEntry.reply == 0 && (
                                                <div className="blogEntryBack">
                                                    <div className="blogEntry">
                                                        <div className="blogName">
                                                            {blogEntry.website !=
                                                                "" &&
                                                                super_admin && (
                                                                    <a
                                                                        href={
                                                                            blogEntry.website
                                                                        }
                                                                        target={
                                                                            "_blank"
                                                                        }
                                                                    >
                                                                        {
                                                                            blogEntry.name
                                                                        }
                                                                    </a>
                                                                )}
                                                            {blogEntry.website ==
                                                                "" &&
                                                                blogEntry.name}
                                                        </div>
                                                        <div className="blogText">
                                                            {blogEntry.comment}
                                                        </div>

                                                        {blogComments &&
                                                            blogComments.map(
                                                                (reply) => {
                                                                    return (
                                                                        <React.Fragment
                                                                            key={
                                                                                reply.id
                                                                            }
                                                                        >
                                                                            {reply.reply ==
                                                                                blogEntry.id &&
                                                                                reply.reply >
                                                                                    0 && (
                                                                                    <div
                                                                                        className="blogEntryBack"
                                                                                        id="reply"
                                                                                    >
                                                                                        <div className="blogName">
                                                                                            {
                                                                                                reply.name
                                                                                            }
                                                                                        </div>
                                                                                        <div className="blogText">
                                                                                            {
                                                                                                reply.comment
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                        </React.Fragment>
                                                                    );
                                                                }
                                                            )}
                                                    </div>
                                                    <div className="blogReplyBack">
                                                        <div className="blogReplyOptions">
                                                            {!reply &&
                                                                super_admin && (
                                                                    <div
                                                                        className="blogDelete"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            setSelectedComment(
                                                                                blogEntry.id
                                                                            );
                                                                            deleteAboutComment(
                                                                                blogEntry.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        DELETE
                                                                    </div>
                                                                )}

                                                            <div
                                                                className="blogReply"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    setReply(
                                                                        !reply
                                                                    );
                                                                    setSelectedComment(
                                                                        blogEntry.id
                                                                    );
                                                                }}
                                                            >
                                                                {(!reply &&
                                                                    "🡬 REPLY") ||
                                                                    (reply &&
                                                                        selectedComment ==
                                                                            blogEntry.id &&
                                                                        "Close") ||
                                                                    "REPLY"}
                                                            </div>
                                                        </div>
                                                        {reply &&
                                                            selectedComment ==
                                                                blogEntry.id && (
                                                                <textarea
                                                                    placeholder="Say Something..."
                                                                    className="replyArea"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setReplyText(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                ></textarea>
                                                            )}
                                                    </div>
                                                    {reply &&
                                                        selectedComment ==
                                                            blogEntry.id && (
                                                            <div
                                                                className="aboutCommentControls"
                                                                id="aboutReplyControls"
                                                            >
                                                                <input
                                                                    autoComplete="none"
                                                                    placeholder="Your Name"
                                                                    className="aboutInput"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setUserName(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                ></input>
                                                                <input
                                                                    className="aboutInput"
                                                                    autoComplete="none"
                                                                    placeholder="Your Email"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setEmail(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                ></input>
                                                                <input
                                                                    className="aboutInput"
                                                                    autoComplete="none"
                                                                    placeholder="Website"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setWebsite(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                ></input>
                                                            </div>
                                                        )}
                                                    {reply &&
                                                        selectedComment ==
                                                            blogEntry.id && (
                                                            <div
                                                                className="sendAboutComment"
                                                                id={
                                                                    (!comment &&
                                                                        !userName &&
                                                                        !email &&
                                                                        "sendAboutComment") ||
                                                                    "sendReply"
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    sendComment();
                                                                }}
                                                            >
                                                                Send
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    )}
                    {!commentSection && (
                        <textarea
                            className="saySomethingBack"
                            onChange={(e) => {
                                setComment(e.target.value);
                            }}
                        ></textarea>
                    )}

                    {commentSection && (
                        <div
                            className="sendAboutCommentToggler"
                            onClick={(e) => {
                                setCommentSection(!commentSection);
                            }}
                        >
                            Leave A Comment
                        </div>
                    )}
                    {!commentSection && (
                        <div className="aboutCommentControls">
                            <input
                                autoComplete="none"
                                placeholder="Your Name"
                                className="aboutInput"
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                }}
                            ></input>
                            <input
                                className="aboutInput"
                                autoComplete="none"
                                placeholder="Your Email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            ></input>
                            <input
                                className="aboutInput"
                                autoComplete="none"
                                placeholder="Website"
                                onChange={(e) => {
                                    setWebsite(e.target.value);
                                }}
                            ></input>
                        </div>
                    )}
                    {!commentSection && (
                        <div
                            className="sendAboutComment"
                            id={
                                (!comment &&
                                    !userName &&
                                    !email &&
                                    "sendAboutComment") ||
                                ""
                            }
                            onClick={(e) => {
                                sendComment();
                            }}
                        >
                            Send
                        </div>
                    )}
                </div>
            </div>
            <div
                className="aboutCover"
                style={{
                    backgroundImage: `url(/about/about${imgCount}.jpg)`,
                }}
            ></div>
        </div>
    );
}
