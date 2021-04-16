const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith(
                    "https://thousandgigs.herokuapp.com"
                )
        ),
});

app.use(function(req, res, next) {
  res.header(
      "Access-Control-Allow-Origin",
      "http://localhost:3000" || "https://thousandgigs.herokuapp.com"
  ); 
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers",
'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  next();
});

const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config");

const crs = require("crypto-random-string");

const { hash, compare } = require("./utils/bc");

const cookieSession = require("cookie-session");

const cookieSessionMiddleware = cookieSession({
    secret: `Hands 0FF ! This one is #dangerous to taz.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/gig-creator", (req, res) => {
    if (!req.session.youGotIt) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/gig-editor", (req, res) => {
    if (!req.session.youGotIt) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/chat", (req, res) => {
    if (!req.session.youGotIt) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/login", (req, res) => {
    console.log("login body", req.body);
    if (req.body.nickname && req.body.password) {
        const { nickname, password } = req.body;
        db.loginCheck(nickname)
            .then(({ rows }) => {
                console.log("LOGIN ROWS", rows);
                if (!rows) {
                    res.json({ data: null });
                }
                compare(req.body.password, rows[0].password_hash)
                    .then((match) => {
                        if (match) {
                            req.session.userId = rows[0].id;
                            res.json({ data: rows[0] });
                        } else {
                            res.json({ error: true });
                        }
                    })
                    .catch((err) => {
                        res.json({ error: true });
                        console.log(err);
                    });
            })
            .catch((err) => {
                res.json({ error: true });
                console.log(err);
            });
    } else {
        res.json({ data: null });
    }
});

app.post("/register", (req, res) => {
    console.log("registration body", req.body);
    if (req.body.nickname && req.body.password) {
        const { nickname, password } = req.body;
        hash(password)
            .then((password_hash) => {
                db.addRegistration(nickname, password_hash)
                    .then(({ rows }) => {
                        console.log("REGISTRATION ROWS", rows);
                        req.session.userId = rows[0].id;
                        console.log("USER ID IN COOKIE:", req.session.userId);
                        res.json({ data: rows[0] });
                    })
                    .catch((err) => {
                        res.json({ error: true });
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({ data: null });
    }
});

app.get("/user-details", (req, res) => {
    db.getUser(req.session.userId)
        .then(({ rows }) => {
            if (rows[0].admin) {
                req.session.youGotIt = "yes";
            }
            console.log("GETTING USER ROWS", rows);
            res.json({ data: rows[0] });
        })
        .catch((err) => console.log(err));
});

app.post("/gig-creator", (req, res) => {
    let { date, venue, lat, lng, tour_name, city } = req.body;
    if (!req.body.tour_name) {
        tour_name = "";
    }
    if (!req.body.venue) {
        venue = "";
    }
    if (!req.body.city) {
        city = "";
    }
    console.log("REQ BODY", req.body);
    db.addGig(date, venue, lat, lng, tour_name, city)
        .then(({ rows }) => {
            console.log("THIS GIG WAS CREATED", rows);
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ error: true });
            console.log(err);
        });
});

app.get("/get-gigs", (req, res) => {
    db.getGigs()
        .then(({ rows }) => {
            // console.log("GETTING GIGS FULL LIST ROWS", rows);
            res.json({ data: rows });
        })
        .catch((err) => console.log(err));
});

app.post("/get-gig-to-edit", (req, res) => {
    console.log("GET GIG TO EDIT REQ BODY", req.body);
    db.getGigToEdit(req.body.selectedGig)
        .then(({ rows }) => {
            console.log("GETTING GIG TO EDIT ROWS", rows);
            res.json({ data: rows[0] });
        })
        .catch((err) => console.log(err));
});

app.post("/gig-update", (req, res) => {
    console.log("UPDATE GIG REQ BODY", req.body);
    let { date, venue, lat, lng, tour_name, city } = req.body.selectedGig;
    db.updateGig(
        req.body.date || date,
        req.body.venue || venue,
        req.body.lat || lat,
        req.body.lng || lng,
        req.body.tour_name || tour_name,
        req.body.city || city
    )
        .then(({ rows }) => {
            console.log("GETTING UPDATED GIG ROWS", rows);
            res.json({ data: rows[0] });
        })
        .catch((err) => {
            res.json({ error: true });
            console.log(err);
        });
});

app.post("/gig-delete", (req, res) => {
    console.log("DELETE GIG REQ BODY", req.body);
    db.getGig(req.body.selectedGig.id)
        .then(({ rows }) => {
            if (rows[0].poster) {
                const file2delete = rows[0].poster.replace(s3Url, "");
                console.log("file2delete", file2delete);
                s3.delete(file2delete);
                console.log("pic delete done");
            }
        })
        .catch((err) => {
            res.json({ error: true });
            console.log(err);
        });

    db.deleteGig(req.body.selectedGig.date)
        .then(({ rows }) => {
            console.log("GETTING DELETED GIG ROWS", rows);
            res.json({ deleteSuccess: true });
        })
        .catch((err) => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;

    console.log("filename", filename);
    const data = JSON.parse(req.body.data);
    console.log("DATA FROM UPLOADERS FORMDATA", data);

    db.getGig(data.id)
        .then(({ rows }) => {
            if (rows[0].poster) {
                const file2delete = rows[0].poster.replace(s3Url, "");
                console.log("file2delete", file2delete);
                s3.delete(file2delete);
                console.log("pic delete done");
            }
        })
        .catch((err) => {
            res.json({ error: true });
            console.log(err);
        });
    db.addImage(data.id, s3Url + filename)
        .then(({ rows }) => {
            console.log(rows, "THIS POSTER WAS CREATED", rows[0].poster);
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ error: true });
            console.log(err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// let tables = [];
// db.check()
//     .then(({ rows }) => {
//         console.log("Check", rows);

//         for (var i = 0; i < rows.length; i++) {
//             tables =  tables.concat(rows[i].tablename, );
//         }
//         console.log("tables", tables);
//     })

//     .catch((err) => console.log(err));


server.listen(process.env.PORT || 3001, () =>
    console.log(
        `🟢 Listening Port ${server.address().port} ... ~ 100mods Gig Guide ~`
    )
);

let onlineUsers = {};
io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    onlineUsers[socket.id] = userId;

    console.log("ONLINE USERS", onlineUsers);

    const userIds = Object.values(onlineUsers);
    console.log("USER IDSSSS", userIds);

    let filteredUsers = userIds.filter(
        (id, index) => userIds.indexOf(id) === index
    );
    console.log("filtered userIds connected:", filteredUsers);

    db.getOnlineUsers(filteredUsers).then(({ rows }) => {
        console.log(`filtered users rows`, rows);
        io.emit("users online", rows);
    });

    db.getUser(userId)
        .then(({ rows }) => {
            socket.broadcast.emit("userJoined", rows);
        })
        .catch((err) => console.log(err));

    db.getChatMsgs()
        .then(({ rows }) => {
            // console.log(" chat-messages ROWS", rows);
            socket.emit("chatMessages", rows);
        })
        .catch((err) => console.log(err));

    socket.on("A CHAT MSG", (msg) => {
        db.addChatMsg(userId, msg)
            .then(() => {
                db.getChatMsgs()
                    .then(({ rows }) => {
                        console.log(" chat-messages ROWS IN MSG", rows);
                        io.emit("chatMessage", rows[0]);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    });

    console.log("socket userId", userId);
    console.log(`socket ${socket.id} connected`);

    socket.on("disconnect", () => {
        var userIdDisconnected = onlineUsers[socket.id];
        var userStillOnline = false;
        delete onlineUsers[socket.id];

        for (var socketId in onlineUsers) {
            if (onlineUsers[socketId] == userIdDisconnected) {
                userStillOnline = true;
            }
        }
        console.log("userStillOnline:", userStillOnline);
        if (!userStillOnline) {
            console.log(`userId: ${userIdDisconnected} disconnected!`);
            io.emit("userLeft", userIdDisconnected);
        }

        console.log(`socket ${socket.id} disconnected`);
    });

    io.emit("trying to talk to everyone", {
        userId,
    });

    socket.emit("welcome", {
        message: "Welome. It is nice to see you",
    });
});
