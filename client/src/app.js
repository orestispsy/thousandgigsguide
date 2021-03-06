import { Component } from "react";
import ReactDOM from "react-dom";
import axios from "./tools/axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Main from "./main";
import AppBar from "./appBar";
import MyMap from "./map";
import GigCreator from "./gigCreator";
import GigEditor from "./gigEditor";
import GigList from "./gigList";
import Chat from "./chat";
import GigListAnimation from "./gigListAnimation";
import GigEntry from "./gigEntry";
import SuperAdmin from "./superAdmin";
import About from "./about";

import C4 from "./c4"

import radioBroadcasts from "./tools/radioBroadcasts";

var body = document.querySelectorAll("body");

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maps: false,
            list: false,
            visitors: false,
            chat_img: false,
            chat_color: false,
            left: body[0].offsetWidth,
            sliderWidth: 0,
            move: false,
            sliderHidden: false,
            selectedGigEntry: false,
            guest: false,
            listScroller: false,
            darkMode: true,
            year: false,
            nightFlightProg: false,
            top: "1%",
            left: `35%`,
            chatNotification: false,
            chatMode: false,
            aboutMode: false,
        };
    }

    componentDidMount() {
        this.mapVisible(false);
        axios
            .get("/user-details")
            .then(({ data }) => {
                if (!data.data) {
                    location.replace("/");
                }
                this.setState({
                    id: data.data.id,
                    nickname: data.data.nickname,
                    admin: data.data.admin,
                    super_admin: data.data.super_admin,
                    chat_img: data.data.chat_img,
                    chat_color: data.data.chat_color,
                });
                if (data.data.nickname) {
                    if (data.data.nickname.includes("Guest"))
                        this.setState({
                            guest: true,
                            admin: false,
                        });
                }
            })
            .catch((err) => {
                console.log("err in axios App User POST Request : ", err);
            });

        axios
            .get("/get-gigs")
            .then(({ data }) => {
                this.setState({
                    gigsList: data.data.reverse(),
                });
            })
            .catch((err) => {
                console.log("err in axios App User POST Request : ", err);
            });

        axios
            .get("/counter")
            .then(({ data }) => {
                this.setState({
                    visitors: data.data,
                });
            })
            .catch((err) => {
                console.log("err in axios App User POST Request : ", err);
            });
    }

    mapVisible(e) {
        this.setState({
            maps: e,
        });
    }

    setGigEntry(e) {
        this.setState({
            selectedGigEntry: e,
        });
    }

    setProfileImage(e) {
        this.setState({
            chat_img: e,
        });
    }

    listSet(e) {
        this.setState({
            list: e,
        });
    }

    setListScroller(e) {
        this.setState({
            listScroller: e,
        });
    }

    setNickname(e) {
        this.setState({
            nickname: e,
        });
    }

    setAdmin(e) {
        this.setState({
            admin: e,
        });
    }

    setDarkMode(e) {
        this.setState({
            darkMode: e,
        });
    }

    setYear(e) {
        this.setState({
            year: e,
        });
    }

    setRadioBroadcast(e) {
        this.setState({
            nightFlightProg: e,
        });
    }

    setGigsList(e) {
        this.setState({
            gigsList: e,
        });
    }

    setChatNotification(e) {
        this.setState({
            chatNotification: e,
        });
    }

    setPlayerPosition(x, y) {
        this.setState({
            top: x,
            left: y,
        });
    }

    setChatMode(e) {
        this.setState({
            chatMode: e,
        });
    }

    setAboutMode(e) {
        this.setState({
            aboutMode:e
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div
                    className={
                        (this.state.aboutMode && "appContainerAbout") ||
                        (this.state.maps && "appContainerMap") ||
                        (this.state.list && "appContainerList") ||
                        (this.state.darkMode && "appContainerDark") ||
                        (!this.state.list && "appContainer")
                    }
                    style={{
                        backgroundImage:
                            this.state.aboutMode && `url(/about/about1.jpg)`,
                    }}
                >
                    <Route
                        exact
                        path="*"
                        render={(props) => (
                            <AppBar
                                chat_img={this.state.chat_img}
                                nickname={this.state.nickname}
                                setRadioBroadcast={(e) =>
                                    this.setRadioBroadcast(e)
                                }
                                radioBroadcasts={this.radioBroadcasts}
                                nightFlightProg={this.state.nightFlightProg}
                                maps={this.state.maps}
                                setGigEntry={(e) => this.setGigEntry(e)}
                                mapVisible={(e) => this.mapVisible(e)}
                                top={this.state.top}
                                left={this.state.left}
                                setPlayerPosition={(x, y) =>
                                    this.setPlayerPosition(x, y)
                                }
                                setChatNotification={(e) =>
                                    this.setChatNotification(e)
                                }
                                chatNotification={this.state.chatNotification}
                                chatMode={this.state.chatMode}
                                aboutMode={this.state.aboutMode}
                                setAboutMode={(e) => this.setAboutMode(e)}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <Main
                                super_admin={this.state.super_admin}
                                admin={this.state.admin}
                                listSet={(e) => this.listSet(e)}
                                visitors={this.state.visitors}
                                guest={this.state.guest}
                                darkMode={this.state.darkMode}
                                listSet={(e) => this.listSet(e)}
                                list={this.state.list}
                                setDarkMode={(e) => this.setDarkMode(e)}
                                setChatNotification={(e) =>
                                    this.setChatNotification(e)
                                }
                                setChatMode={(e) => this.setChatMode(e)}
                                aboutMode={this.state.aboutMode}
                                setAboutMode={(e) => this.setAboutMode(e)}
                            />
                        )}
                    />

                    <Route
                        exact
                        path="/gig-creator"
                        render={(props) => (
                            <GigCreator
                                admin={this.state.admin}
                                darkMode={this.state.darkMode}
                                setGigsList={(e) => this.setGigsList(e)}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/gig-editor"
                        render={(props) => (
                            <GigEditor
                                gigsList={this.state.gigsList}
                                admin={this.state.admin}
                                darkMode={this.state.darkMode}
                                setGigsList={(e) => this.setGigsList(e)}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/map"
                        render={(props) => (
                            <MyMap
                                gigsList={this.state.gigsList}
                                mapVisible={(e) => this.mapVisible(e)}
                                selectedGigEntry={this.state.selectedGigEntry}
                                setGigEntry={(e) => this.setGigEntry(e)}
                                guest={this.state.guest}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/gig-list"
                        render={(props) => (
                            <GigList
                                gigsList={this.state.gigsList}
                                listSet={(e) => this.listSet(e)}
                                setListScroller={(e) => this.setListScroller(e)}
                                listScroller={this.state.listScroller}
                                year={this.state.year}
                                setYear={(e) => this.setYear(e)}
                            />
                        )}
                    />

                    <Route
                        path="/api/gig/:id"
                        render={(props) => (
                            <GigEntry
                                match={props.match}
                                gigsList={this.state.gigsList}
                                myUserId={this.state.id}
                                super_admin={this.state.super_admin}
                                nickname={this.state.nickname}
                                listSet={(e) => this.listSet(e)}
                                history={props.history}
                                setGigEntry={(e) => this.setGigEntry(e)}
                                selectedGigEntry={this.state.selectedGigEntry}
                                guest={this.state.guest}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/c4"
                        render={(props) => (
                            <C4
                                
                            />
                        )}
                    />

                    <Route
                        exact
                        path="/gig-list-animation"
                        render={(props) => (
                            <GigListAnimation
                                gigsList={this.state.gigsList}
                                listSet={(e) => this.listSet(e)}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/chat"
                        render={(props) => (
                            <Chat
                                chat_img={this.state.chat_img}
                                chat_myUserId={this.state.id}
                                chat_color={this.state.chat_color}
                                admin={this.state.admin}
                                setAdmin={(e) => this.setAdmin(e)}
                                super_admin={this.state.super_admin}
                                setProfileImage={(e) => this.setProfileImage(e)}
                                nickname={this.state.nickname}
                                guest={this.state.guest}
                                setNickname={(e) => this.setNickname(e)}
                                darkMode={this.state.darkMode}
                                listSet={(e) => this.listSet(e)}
                                list={this.state.list}
                                setDarkMode={(e) => this.setDarkMode(e)}
                                setRadioBroadcast={(e) =>
                                    this.setRadioBroadcast(e)
                                }
                                radioBroadcasts={radioBroadcasts}
                                nightFlightProg={this.state.nightFlightProg}
                                setChatMode={(e) => this.setChatMode(e)}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/super-admin"
                        render={(props) => (
                            <SuperAdmin
                                super_admin={this.state.super_admin}
                                chat_myUserId={this.state.id}
                                listSet={(e) => this.listSet(e)}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/about"
                        render={(props) => (
                            <About
                                aboutMode={this.state.aboutMode}
                                setAboutMode={(e) => this.setAboutMode(e)}
                                super_admin={this.state.super_admin}
                            />
                        )}
                    />
                </div>
            </BrowserRouter>
        );
    }
}
