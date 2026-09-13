CREATE TABLE great_ocean_conference (
    team_logo TEXT NOT NULL,
    team_name TEXT PRIMARY KEY,

    points INTEGER NOT NULL DEFAULT 0
        CHECK (points >= 0),

    touchdowns INTEGER NOT NULL DEFAULT 0
        CHECK (touchdowns >= 0),

    casualties INTEGER NOT NULL DEFAULT 0
        CHECK (casualties >= 0),

    games_played INTEGER NOT NULL DEFAULT 0
        CHECK (games_played >= 0)
);


CREATE TABLE old_world_conference (
    team_logo TEXT NOT NULL,
    team_name TEXT PRIMARY KEY,

    points INTEGER NOT NULL DEFAULT 0
        CHECK (points >= 0),

    touchdowns INTEGER NOT NULL DEFAULT 0
        CHECK (touchdowns >= 0),

    casualties INTEGER NOT NULL DEFAULT 0
        CHECK (casualties >= 0),

    games_played INTEGER NOT NULL DEFAULT 0
        CHECK (games_played >= 0)
);