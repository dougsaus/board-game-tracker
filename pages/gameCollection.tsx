import {Game} from "@/pages/game";
import {parseString} from 'xml2js';

export const fetchGameCollection = async (username: string) => {
    try {
        const input = 'https://api.geekdo.com/xmlapi2/collection?username=' + username;
        console.log(`Fetching: ${input}`);

        const response = await fetch(input);

        if (!response.ok) {
            throw new Error(`Error with response code ${response.status}`);
        }

        let xml = await response.text();
        const games = await convertXmlToGames(username, xml);

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

        if (gameIn.isExpansion) {
            const linkElements = item.link.filter(
                (link: any) => link.$.type === 'boardgame'
            );

            if (linkElements.length > 0) {
                gameIn.expandsGameId = linkElements[0].$.id;
                gameIn.expandsName = linkElements[0].$.value;
            }
        }


        return gameIn;
    } catch (error) {
        console.error(`Error: ${error}`);
        return gameIn;
    }
};

const convertXmlToGames = (username:string, xml: string): Promise<Game[]> => {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            const games: Game[] = result.items.item.map((item: any) => ({
                gameId: item.$.objectid,
                name: item.name[0]._,
                username: username,
            }));

            resolve(games);
        });
    });
};

