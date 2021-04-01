import React from "react";
import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
} from "react-google-maps";
import { useState, useEffect } from "react";
import mapStyles from "./tools/mapStyles";

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../../secrets.json");
}

const WithGoogleMapComponent = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${secrets.key}`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    console.log("take some props", props);
    return (
        <GoogleMap
            zoom={3}
            center={props.center}
            options={{
                styles: mapStyles.modest,
                disableDefaultUI: true,
                zoomControl: true,
            }}
        >
            {props.gigsList &&
                props.gigsList.map((gig) => (
                    <Marker
                        key={gig.id}
                        position={{
                            lat: parseFloat(gig.lat),
                            lng: parseFloat(gig.lng),
                        }}
                        icon={{
                            url: "greendot.gif",
                            scaledSize: new window.google.maps.Size(50, 25),
                        }}
                        onClick={() => {
                            props.setSelectedGig(gig);
                        }}
                    />
                ))}
            {props.selectedGig && (
                <InfoWindow
                    position={{
                        lat: parseFloat(props.selectedGig.lat),
                        lng: parseFloat(props.selectedGig.lng),
                    }}
                    onCloseClick={() => {
                        props.setSelectedGig(null);

                        console.log("whatever");
                    }}
                >
                    <div className="mapInfoCard">
                        <div
                            style={{
                                color: `yellow`,
                                textDecoration: `underline`,
                                textUnderlineOffset: `3px`,
                                fontFamily: "Poller One, cursive",
                            }}
                        >
                            {props.selectedGig.date}
                        </div>
                        {props.selectedGig.poster && (
                            <img
                                className="infoPoster"
                                src={
                                    props.selectedGig.poster &&
                                    props.selectedGig.poster
                                }
                            ></img>
                        )}
                        {props.selectedGig.venue && (
                            <div>
                                Venue <span>➤</span> {props.selectedGig.venue}
                            </div>
                        )}
                        {props.selectedGig.city && (
                            <div>
                                City/Place <span>➤</span>{" "}
                                {props.selectedGig.city}
                            </div>
                        )}
                        {props.selectedGig.tour_name && (
                            <div>
                                Tour <span>➤</span>{" "}
                                {props.selectedGig.tour_name}
                            </div>
                        )}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
});

const MyMap = ({ gigsList, mapVisible }) => {
    const [selectedGig, setSelectedGig] = useState(null);
    const [zoom, setZoom] = useState(4);
    const [center, setCenter] = useState({
        lat: 35.15941671007103,
        lng: -40.37015727806882,
    });

    useEffect(function () {
        mapVisible();
    }, []);

    return (
        <div className="google-map">
            <WithGoogleMapComponent
                gigsList={gigsList}
                selectedGig={selectedGig}
                setCenter={setCenter}
                center={center}
                setSelectedGig={setSelectedGig}
            />
        </div>
    );
};

export default MyMap;
