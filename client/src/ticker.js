import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import ReactDOM from "react-dom";

let emoji = require("./tools/customEmoj.json");
let tickerEntries = require("./tools/tickerEntries.json");

export default function Ticker({}) {
    useEffect(function () {}, []);

    const tickerRef = useRef();

    if (tickerRef.current) {
        console.log(tickerRef.current.children);
        var { offsetLeft } = tickerRef.current;
        console.log(offsetLeft);

        var headlines = document.querySelectorAll("#headlines");
        var body = document.querySelectorAll("body");

        var links = document.querySelectorAll(".tickerLink");

        var left = headlines[0].offsetLeft;

        var requestid;

        if (left) {
            const moveHeadlines = () => {
                left = left - 2;
                if (left < -headlines[0].offsetWidth) {
                    left = body[0].offsetWidth;
                }
                headlines[0].style.left = left + "px";
                requestid = requestAnimationFrame(moveHeadlines);
            };

            const stopHeadlines = () => {
                for (var i = 0; i < links.length; i++) {
                    links[i].addEventListener("mouseenter", function (event) {
                        event.target.style.color = "white";
                        cancelAnimationFrame(requestid);
                    });

                    links[i].addEventListener("mouseleave", function (event) {
                        moveHeadlines();
                        event.target.style.color = "lime";
                        event.target.style.textDecoration = "none";
                    });
                }
            };

            moveHeadlines();
            stopHeadlines();
        }
    }

    return (
        <div id="headlines" ref={tickerRef}>
            {/* {emoji && emoji.map((emoj) => { 
                
                return (
                    <div
                        key={emoj.id}
                        style={{
                            display:`flex`,
                            flexDirection:`column`,
                            width:`100vw`
                        }}
                    >
                        <img
                            style={{
                                width: `1vmax`,
                                height: `1vmax`,
                            }}
                            src={emoj.url}
                        ></img>
                    </div>
                );

            })} */}
            <a className="tickerLink" target="_blank">
                Welcome My Friends
            </a>
            <a className="tickerLink" target="_blank">
                So nice to see you here
            </a>
            <a className="tickerLink" target="_blank">
                I hope you enjoy your stay !
            </a>
            <a className="tickerLink" target="_blank">
                Let me share some nice music links with you . . .
            </a>
            <a
                className="tickerLink"
                href="https://www.mixcloud.com/WeirdFishesRadio/night-flight-du-beast-special-vol-i-sitting-at-the-bar-with-john/"
                target="_blank"
            >
                Du Beast Special Vol. I : "Sitting at the Bar with John"
            </a>
            <a
                className="tickerLink"
                href="https://www.mixcloud.com/WeirdFishesRadio/night-flight-09042020/"
                target="_blank"
            >
                Night Flight [09.04.2020]
            </a>
            <a
                className="tickerLink"
                href="https://www.mixcloud.com/WeirdFishesRadio/night-flight-12112020/"
                target="_blank"
            >
                Night Flight [12.11.2020]
            </a>
            <a
                className="tickerLink"
                href="https://www.mixcloud.com/WeirdFishesRadio/night-flight-du-beast-special-vol-ii/"
                target="_blank"
            >
                Du Beast Special Vol. II
            </a>
            <a
                className="tickerLink"
                href="https://www.mixcloud.com/WeirdFishesRadio/night-flight-30052019/"
                target="_blank"
            >
                Night Flight [30.05.2019]
            </a>
            <a
                className="tickerLink"
                href=" https://www.mixcloud.com/WeirdFishesRadio/night-flight-08042021/"
                target="_blank"
            >
                Night Flight [08.04.2021]
            </a>
        </div>
    );
}