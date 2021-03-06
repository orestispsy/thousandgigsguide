import { Component } from "react";
import axios from "./tools/axios";
import { Link } from "react-router-dom";

import Community from "./community";
import Comments from "./comments";

export default class GigEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            id: "",
            venue: "",
            date: "",
            tour_name: "",
            poster: "",
            selectedGig: false,
            toggleComments: false,
        };
    }

    componentDidMount() {
        this.props.listSet(true);

        axios
            .get("/gig/" + this.props.match.params.id)
            .then(({ data }) => {
                this.setState({
                    city: data.data.city,
                    id: data.data.id,
                    venue: data.data.venue,
                    date: data.data.date,
                    tour_name: data.data.tour_name,
                    poster: data.data.poster,
                    selectedGig: data.data.date,
                    
                });
                   this.props.setGigEntry(data.data);
            })
            .catch((err) => {
                console.log("err in Gig Entry GET Request : ", err);
            });
    }

    gigSelector(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                // console.log("State after setState: ", this.state);
                axios
                    .post("/get-gig-to-edit", this.state)
                    .then(({ data }) => {
                        if (data.data) {
                            this.setState({
                                city: data.data.city,
                                id: data.data.id,
                                venue: data.data.venue,
                                date: data.data.date,
                                tour_name: data.data.tour_name,
                                poster: data.data.poster,
                            });
                            this.props.history.push(
                                `/api/gig/${this.state.id}`
                            );
                                 this.props.setGigEntry(data.data);
                        }
                    })
                    .catch((err) => {
                        console.log(
                            "err in axios Gig Entry Get Request : ",
                            err
                        );
                    });
            }
        );
    }

    toggleComments() {
        this.setState({
            toggleComments: !this.state.toggleComments,
        });
    }

    render() {
        return (
            <div className="gigEntryContainer">
                <form>
                    <Link
                        to="/map"
                        className="gigEntryMapLink"
                        title="Map"
                    ></Link>
                    <select
                        name="selectedGig"
                        className="selectGigEntry"
                        onChange={(e) => this.gigSelector(e)}
                    >
                        <option className="chooseGig" value="">
                            Select Gig
                        </option>
                        {this.props.gigsList &&
                            this.props.gigsList.map((gig) => (
                                <option value={gig.date} key={gig.id}>
                                    {gig.date} {gig.venue}
                                </option>
                            ))}
                    </select>
                </form>
                <div className="gigEntryDetailsBack">
                    <div className="gigEntryDetails">
                        {this.state.poster && (
                            <img src={this.state.poster}></img>
                        )}
                        <div className="detailedEntry">
                            <span>Venue</span>
                            <h1>{this.state.venue}</h1>
                            <span>City</span>
                            <h1>
                                {" "}
                                {(this.state.selectedGig &&
                                    this.state.selectedGig.city) ||
                                    this.state.city}
                            </h1>
                            <span>Tour Name</span>
                            <h1>{this.state.tour_name}</h1>
                            <span>Date</span>
                            <h1>{this.state.date}</h1>
                        </div>
                    </div>
                    {!this.state.toggleComments && (
                        <Community
                            selectedGigId={this.state.id}
                            myUserId={this.props.myUserId}
                            super_admin={this.props.super_admin}
                            nickname={this.props.nickname}
                            toggleComments={() => this.toggleComments()}
                            guest={this.props.guest}
                        />
                    )}
                    {this.state.toggleComments && (
                        <Comments
                            selectedGigId={this.state.id}
                            myUserId={this.props.myUserId}
                            super_admin={this.props.super_admin}
                            nickname={this.props.nickname}
                            toggleComments={() => this.toggleComments()}
                        />
                    )}
                </div>
            </div>
        );
    }
}
