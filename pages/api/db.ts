import {Pool, PoolClient, QueryResult} from 'pg';
import { Game } from '@/pages/game';

const pool = new Pool({
    user: 'postgres',
    password: 'bgdb',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
});

export const writeGameRecordsToDatabase = async (games: Game[]) => {
    try {
        const client:PoolClient = await pool.connect();

        console.log(games);

        // Create the schema if it doesn't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS games (
            gameId INT,
            username TEXT,
            name TEXT,
            description TEXT,
            isExpansion BOOLEAN,
            image TEXT,
            expandsGameId INT,
            expandsName TEXT,
            PRIMARY KEY (gameId, username)
          );
        `);

        // Insert or update game records in the database
        for (const game of games) {
            await client.query(
                `
                INSERT INTO games (gameId, username, name, description, isExpansion, image, expandsGameId, expandsName)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (gameId, username)
                DO UPDATE SET
                  name = EXCLUDED.name,
                  description = CASE WHEN EXCLUDED.description IS NOT NULL THEN EXCLUDED.description ELSE games.description END,
                  isExpansion = EXCLUDED.isExpansion,
                  image = EXCLUDED.image,
                  expandsGameId = EXCLUDED.expandsGameId,
                  expandsName = EXCLUDED.expandsName
                WHERE EXCLUDED.description IS NOT NULL;
                `,
                [
                    game.gameId,
                    game.username,
                    game.name,
                    game.description,
                    game.isExpansion,
                    game.image,
                    game.expandsGameId,
                    game.expandsName
                ]
            );
        }
        await client.query('COMMIT');

        client.release();
        console.log('Game records written to the database successfully.');
    } catch (error) {
        console.error('Error writing game records to the database:', error);
    }
};

export const loadGamesByUsername = async (username: string): Promise<Game[]> => {
    try {
        const client:PoolClient = await pool.connect();
        const query:string = 'SELECT * FROM games WHERE username = $1';
        const result:QueryResult<Game> = await client.query(query, [`${username}`]);
        client.release();
        return result.rows;
    } catch (error) {
        console.error('Error loading games by username:', error);
        return [];
    }
};


export default pool;
