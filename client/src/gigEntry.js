import { Component } from "react";
import axios from "./tools/axios";
import { Link } from "react-router-dom";

export default class GigEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/gig/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log
                this.setState({
                    city: data.data.city,
                    id: data.data.id,
                    venue: data.data.venue,
                    date: data.data.date,
                    tour_name: data.data.tour_name,
                    poster: data.data.poster,
                    selectedGig: data.data.date,
                });
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

                            console.log("selected Gig", this.state.selectedGig);
                        }
                    })
                    .catch((err) => {
                        console.log(
                            "err in axios App User POST Request : ",
                            err
                        );
                    });
            }
        );
    }

    render() {
        return (
            <div className="gigEntryContainer">
                <form>
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

                <div className="gigEntryDetails" >
                    {this.state.poster && <img src={this.state.poster}></img>}
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
                <Link to="/gig-list/" className="backLink">
                    Back
                </Link>
            </div>
        );
    }
}