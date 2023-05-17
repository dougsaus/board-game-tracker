import {Game} from "@/pages/game";
import {parseString} from 'xml2js';


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


export const fetchGameCollection = async (user: string) => {
    try {
        const input = 'https://api.geekdo.com/xmlapi2/collection?username=' + user;
        console.log(`Fetching: ${input}`);

        const response = await fetch(input);

        if (!response.ok) {
            throw new Error(`Error with response code ${response.status}`);
        }

        let xml = await response.text();
        const games = await convertXmlToGames(xml);

        const enrichedGames = await Promise.all(games.map(enrichGame));

        console.log(enrichedGames);
        return enrichedGames;
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

const enrichGame = async (gameIn: Game): Promise<Game> => {
    try {
        const input = 'https://api.geekdo.com/xmlapi2/thing?id=' + gameIn.gameId;
        console.log(`Fetching: ${input}`);

        const response = await fetch(input);

        if (!response.ok) {
            console.error(`Error with response code ${response.status}`);
            return gameIn;
        }

        let xml = await response.text();

        const parsedXml: any = await new Promise((resolve, reject) => {
            parseString(xml, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const item = parsedXml.items.item[0];
        gameIn.description =  item.description[0];
        gameIn.isExpansion = item.$.type === 'boardgameexpansion';
        gameIn.image = item.image[0];
        let expandsGameId:string = '';
        let expandsName:string = '';

        if (gameIn.isExpansion) {
            const linkElements = item.link.filter(
                (link: any) => link.$.type === 'boardgame'
            );

            if (linkElements.length > 0) {
                expandsGameId = linkElements[0].$.id;
                expandsName = linkElements[0].$.value;
            }
        }

        gameIn.expandsGameId = expandsGameId;
        gameIn.expandsName = expandsName;

        return gameIn;
    } catch (error) {
        console.error(`Error: ${error}`);
        return gameIn;
    }
};

const convertXmlToGames = (xml: string): Promise<Game[]> => {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            const games: Game[] = result.items.item.map((item: any) => ({
                gameId: item.$.objectid,
                name: item.name[0]._,
            }));

            resolve(games);
        });
    });
};

