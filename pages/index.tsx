import {Game} from "@/pages/game";
import React, {useState} from "react";
import GamesComponent from "@/pages/GamesComponent";
import {fetchGameCollection} from "@/pages/gameCollection";

const Home = () => {
    const [username, setUsername] = useState("");
    const [games, setGames] = useState<Game[]>([]);

    const gameCount = games.filter(value => !value.isExpansion).length;
    const expansionCount = games.filter(value => value.isExpansion).length;

    const handleSyncCollectionButtonClick = async () => {
        try {
            const loadedGames: Game[] = await fetchGameCollection(username);
            console.log(loadedGames);
            await postGamesToGameCollectionApi(loadedGames);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDisplayGamesButtonClick = async () => {

        try {
            let loadedGames = await getGamesFromGameCollectionApi(username);
            loadedGames.forEach(game => {
                if (game.isExpansion) {
                    game.expansions = [];
                    game.baseGames = loadedGames.filter(baseGame => baseGame.gameId === game.expandsGameId);
                } else {
                    game.expansions = loadedGames.filter(expansion => expansion.expandsGameId === game.gameId);
                    game.baseGames = [];
                }
            });
            console.log(loadedGames);
            setGames(loadedGames);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <h1>Board Game Collection</h1>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                       placeholder="Enter username"/>
                <button onClick={handleSyncCollectionButtonClick}>Sync Collection With BGG</button>
                <button onClick={handleDisplayGamesButtonClick}>Display Collection</button>
                <hr/>
            </div>
            {games.length > 0 &&
                <div>
                    <h3>Total Number of Base Games in Collection: {gameCount}</h3>
                    <h3>Total Number of Expansions in Collection: {expansionCount}</h3>
                </div>
            }
            {games.length > 0 &&
                <div>
                    <GamesComponent games={games}/>
                </div>
            }

        </main>
    )
        ;
}

const postGamesToGameCollectionApi = async (games: Game[]) => {
    try {
        const response = await fetch("/api/gameCollection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(games),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Success message from the API
        } else {
            console.error("Failed to post games to the api");
        }
    } catch (error) {
        console.error(error);
    }
};

const getGamesFromGameCollectionApi = async (username: string): Promise<Game[]> => {
    try {
        const response = await fetch("/api/gameCollection/" + username);

        if (response.ok) {
            const jsonData = await response.json();

            // Map the JSON data to an array of Game objects
            const games = jsonData.map((gameData: any) => {
                // Construct the Game object based on the JSON data structure
                return {
                    username: gameData.username,
                    gameId: gameData.gameId,
                    name: gameData.name,
                    description: gameData.description,
                    isExpansion: gameData.isExpansion,
                    expandsGameId: gameData.expandsGameId,
                    expandsName: gameData.expandsName,
                    image: gameData.image,
                };
            });
            console.log(games);
            return games;
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while fetching games");
    }
    console.error("Failed to get games from the API");
    throw new Error("Failed to get games from the API");
};

export default Home;

