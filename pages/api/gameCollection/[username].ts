import { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '../../game';
import { loadGamesByUsername } from '../db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { username } = req.query;

    // Check if username is undefined or not a string
    if (!username || typeof username !== 'string') {
        res.status(404).json({ error: 'Not Found' });
        return;
    }

    if (req.method === 'GET') {
        try {
            // Load the games from the database for the specified username
            const games: Game[] = await loadGamesByUsername(username);

            res.status(200).json(games);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while loading games' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
