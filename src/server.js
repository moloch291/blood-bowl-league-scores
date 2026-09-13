require('dotenv').config();

const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      database: 'connected',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

app.get('/api/conferences', async (req, res) => {
  try {
    const [greatOcean, oldWorld] = await Promise.all([
      pool.query(`
        SELECT *
        FROM great_ocean_conference
        ORDER BY points DESC, touchdowns DESC, casualties DESC
      `),

      pool.query(`
        SELECT *
        FROM old_world_conference
        ORDER BY points DESC, touchdowns DESC, casualties DESC
      `),
    ]);

    res.json({
      greatOcean: greatOcean.rows,
      oldWorld: oldWorld.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to load conference standings',
    });
  }
});

const conferences = {
  'great-ocean': 'great_ocean_conference',
  'old-world': 'old_world_conference',
};

app.patch('/api/conferences/:conference/:teamName', async (req, res) => {
  const table = conferences[req.params.conference];

  if (!table) {
    return res.status(404).json({
      error: 'Conference not found',
    });
  }

  const {
    points,
    touchdowns,
    casualties,
    games_played,
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE ${table}
      SET
        points = COALESCE($1, points),
        touchdowns = COALESCE($2, touchdowns),
        casualties = COALESCE($3, casualties),
        games_played = COALESCE($4, games_played)
      WHERE team_name = $5
      RETURNING *
      `,
      [
        points,
        touchdowns,
        casualties,
        games_played,
        req.params.teamName,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Team not found',
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to update team',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Blood Bowl API running on http://localhost:${PORT}`);
});