import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
} from "react-google-maps";
import { compose, withProps } from "recompose";
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
    return (
        <GoogleMap
            zoom={3}
            center={props.center}
            options={{
                styles: mapStyles.green,
                disableDefaultUI: false,
                zoomControl: true,
            }}
            onClick={(e) => {
                props.setShowCoordinates(true);
                props.setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                props.coordinator(e)
            }}
            defaultZoom={8}
            defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
            {props.isMarkerShown && (
                <Marker position={{ lat: -34.397, lng: 150.644 }} />
            )}
            {props.showCoordinates && (
                <InfoWindow
                    position={{
                        lat: props.center.lat,
                        lng: props.center.lng,
                    }}
                    onCloseClick={() => {
                        props.setShowCoordinates(false);
                    }}
                >
                    <div>
                        Latitude: {props.center.lat}
                        <br></br>
                        Longitude: {props.center.lng}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
})

const EditMap = ({ coordinator }) => {
    const [showCoordinates, setShowCoordinates] = useState(false);
    const [center, setCenter] = useState({
        lat: 35.08702515417141,
        lng: -40.71445657001389,
    });

    return (
        <div className="google-map-editor">
            <WithGoogleMapComponent
                center={center}
                setCenter={setCenter}
                showCoordinates={showCoordinates}
                setShowCoordinates={setShowCoordinates}
                coordinator={coordinator}
            />
        </div>
    );
};

export default EditMap;