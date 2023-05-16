export interface Game {
    username: string;
    gameId: number;
    name: string;
    description: string;
    isExpansion: boolean;
    expands: Game;
    image: string;
}

export const fetchGameDetails = async (gameId: number, retries = 2): Promise<any> => {
    // Implement the logic to fetch game details from the BGG JSON API
    const input = `https://bgg-json.azurewebsites.net/thing/${gameId}`;
    console.log(`Fetching: ${input}`);

    try {
        const response = await fetch(input);
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying fetch for gameId ${gameId}. Retries left: ${retries}`);
            return fetchGameDetails(gameId, retries - 1);
        } else {
            throw new Error(`Error fetching game details for gameId ${gameId}`);
        }
    }
};

export const getGameCollection = async (user: string): Promise<Game[]> => {
    try {
        const input = 'http://bgg-json.azurewebsites.net/collection/' + user;
        console.log(`Fetching: ${input}`);
        const response = await fetch(input);
        let json = await response.json();

        if (!response.ok) {
            throw new Error(`Error with response code ${response.status}`);
        }

        const games: Game[] = [];

        // Introduce a delay between each API call
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        const delayBetweenCalls = 50; // Adjust the delay duration as needed (in milliseconds)

        for (const game of json) {
            await delay(delayBetweenCalls);

            try {
                const gameDetails = await fetchGameDetails(game.gameId);
                // Construct the Game object with additional details
                const expandedGame: Game = {
                    username: user,
                    gameId: game.gameId,
                    name: game.name,
                    description: gameDetails.description,
                    isExpansion: gameDetails.isExpansion,
                    expands: gameDetails.expands,
                    image: game.image,
                };

                games.push(expandedGame);
            } catch (error) {
                console.error(`Error fetching details for gameId ${game.gameId}:`, error);
            }
        }

        return games;
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};


