import {Game} from "@/pages/game";

export const getGameCollectionXML = async (user: string) => {
    try {
        const input = 'https://api.geekdo.com/xmlapi2/collection?username=ds3161';
//         const input ='https://api.geekdo.com/xmlapi2/thing?id=224710';
//       const input ='https://api.geekdo.com/xmlapi2/thing?id=250534';
        console.log(`Fetching: ${input}`);
        const response = await fetch(input);
        let text = await response.text();
        // let json = xml2json(text);
        console.log(text);

    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};
export const fetchGameDetails = async (gameId: number, retries = 4): Promise<any> => {
    // Implement the logic to fetch game details from the BGG JSON API
    const input = `https://bgg-json.azurewebsites.net/thing/${gameId}`;
    console.log(`Fetching: ${input}`);

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const delayBetweenCalls = 500; // Adjust the delay duration as needed (in milliseconds)
    await delay(delayBetweenCalls);

    try {
        const response = await fetch(input);
        if (!response.ok)
            if (retries > 0) {
                console.log(`Retrying fetch for gameId ${gameId}. Retries left: ${retries}`);
                return fetchGameDetails(gameId, retries - 1);
            } else {
                console.error(`Error fetching game details for gameId ${gameId}`);
                return null; // Return null when fetch fails after retries
            }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying fetch for gameId ${gameId}. Retries left: ${retries}`);
            return fetchGameDetails(gameId, retries - 1);
        } else {
            console.error(`Error fetching game details for gameId ${gameId}`);
            return null; // Return null when fetch fails after retries
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

        for (const game of json) {
            let gameDetails = null;

            try {
                gameDetails = await fetchGameDetails(game.gameId);
            } catch (error) {
                console.error(`Error fetching details for gameId ${game.gameId}:`, error);
            }

            console.log(gameDetails);

            // Construct the Game object with available details
            const expandedGame: Game = {
                username: user,
                gameId: game.gameId,
                name: game.name,
                description: gameDetails ? gameDetails.description : '',
                isExpansion: gameDetails ? gameDetails.isExpansion : false,
                expandsGameId: gameDetails && gameDetails.expands ? gameDetails.expands[0].gameId : null,
                expandsName: gameDetails && gameDetails.expands ? gameDetails.expands[0].name : null,
                image: game.image,
            };

            games.push(expandedGame);
        }

        return games;
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};