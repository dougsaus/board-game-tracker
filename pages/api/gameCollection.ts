import { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '../game';
import { writeGameRecordsToDatabase } from './db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const games: Game[] = req.body;

            // Write the games to the database
            await writeGameRecordsToDatabase(games);

            res.status(200).json({ message: 'Games successfully written to the database' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while writing to the database' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
