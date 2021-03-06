import { useState, useEffect } from "react";
import axios from "./tools/axios";

export default function Posters({ posterSelector }) {
    const [posters, setPosters] = useState(null);

    useEffect(function () {
        axios
            .get("/get-images")
            .then(({ data }) => {
                setPosters(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="posterEdit">
            {posters &&
                posters.rows.map((poster) => (
                    <img
                        title={poster.poster}
                        src={poster.poster}
                        key={poster.id}
                        className="posterEditPreview"
                        onClick={(e) => posterSelector(e.target.title)}
                    ></img>
                ))}
        </div>
    );
}
