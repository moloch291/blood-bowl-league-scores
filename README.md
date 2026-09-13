# Blood Bowl League API

A small Node.js + Express backend for the Blood Bowl scoreboard league feature.

It stores and serves standings for two conferences:

- Great Ocean Conference
- Old World Conference

League data is persisted in PostgreSQL.

## Features

- PostgreSQL-backed conference standings
- Health check endpoint
- Retrieve both conference tables
- Update team statistics
- Add game results from the scoreboard frontend
- Automatic `games_played` increment when a result is added
- Standings ordered by league points, touchdowns, and casualties

## Tech Stack

- Node.js
- Express
- PostgreSQL
- `pg`
- Docker Compose
- dotenv

## Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose -f database/docker-compose.yaml up -d
```

Create a `.env` file with the database connection settings expected by `src/db.js`.

Run the database migration if the conference tables have not been created yet:

```text
database/migrations/001_create_conferences.sql
```

## Development

Start the API in watch mode:

```bash
npm run dev
```

Start normally:

```bash
npm start
```

The API runs on port `3000` by default.

## API

### Health check

```http
GET /api/health
```

### Conference standings

```http
GET /api/conferences
```

Returns the Great Ocean and Old World conference standings.

### Update a team

```http
PATCH /api/conferences/:conference/:teamName
```

Supported conference keys:

```text
great-ocean
old-world
```

### Add a game result

```http
POST /api/conferences/:conference/results
```

Example body:

```json
{
  "teamName": "Temple Serpents",
  "points": 3,
  "touchdowns": 2,
  "casualties": 1
}
```

The supplied statistics are added to the team's existing totals and `games_played` is incremented by one.

## Project Structure

```text
database/
├── docker-compose.yaml
└── migrations/
    └── 001_create_conferences.sql

src/
├── db.js
└── server.js
```

## Database

Each conference has its own standings table containing:

```text
team_logo
team_name
points
touchdowns
casualties
games_played
```

PostgreSQL data is stored in a Docker volume, so stopping or recreating the database container does not remove the standings unless the volume itself is deleted.
