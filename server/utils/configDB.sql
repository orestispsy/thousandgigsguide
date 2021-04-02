DROP TABLE IF EXISTS community;

CREATE TABLE community (
    id            SERIAL PRIMARY KEY,
    nickname    VARCHAR NOT NULL UNIQUE CHECK (nickname <> ''),
    password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
    admin BOOLEAN DEFAULT false,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gigs (
    id            SERIAL PRIMARY KEY,
    date    VARCHAR NOT NULL UNIQUE CHECK (date <> ''),
    venue VARCHAR DEFAULT false,
    lat    VARCHAR NOT NULL CHECK (lat <> ''),
    lng VARCHAR NOT NULL CHECK (lng <> '') ,
    tour_name VARCHAR DEFAULT false,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    city VARCHAR DEFAULT false,
    poster VARCHAR
);

CREATE TABLE posters (
    id            SERIAL PRIMARY KEY,
    gig_id INT REFERENCES gigs(id) NOT NULL,
    poster      VARCHAR DEFAULT false,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);