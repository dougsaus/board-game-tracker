import {Game} from "@/pages/game";
import {useState} from "react";
import GamesComponent from "@/pages/GamesComponent";
import {getGameCollectionXML, getGameCollection} from "@/pages/gameCollection";

export default function Home() {
    const [username, setUsername] = useState("");
    const [games, setGames] = useState<Game[]>([]);

    const handleLoadGamesButtonClick = async () => {
        try {
            const loadedGames:Game[] = await getGameCollection(username);
            console.log(loadedGames);
            await postGamesToGameCollectionApi(loadedGames);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDisplayGamesButtonClick = async () => {
        try {
            const loadedGames = await getGamesFromGameCollectionApi(username);
            setGames(loadedGames);
        } catch (error) {
            console.error(error);
        }
    };

    const handleXMLButtonClick = async () => {
        try {
            await getGameCollectionXML(username);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <h1>Board Game Collection</h1>

            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
                <button onClick={handleDisplayGamesButtonClick}>Display Collection</button>
                <button onClick={handleLoadGamesButtonClick}>Sync Collection With BGG</button>
                <button onClick={handleXMLButtonClick}>BGG XMLAPI2</button>
            </div>
            <div>
                <hr/>
                <GamesComponent games={games}/>
            </div>
        </main>
    );
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
                    expands: gameData.expands,
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

