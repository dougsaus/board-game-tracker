export class Game {
    username: string;
    gameId: number;
    name: string;
    description: string;
    isExpansion: boolean;
    expandsGameId: number;
    expandsName: string;
    image: string;
    expansions: Game[];
    baseGames: Game[];

    constructor(
        username: string,
        gameId: number,
        name: string,
        description: string,
        isExpansion: boolean,
        expandsGameId: number,
        expandsName: string,
        image: string
    ) {
        this.username = username;
        this.gameId = gameId;
        this.name = name;
        this.description = description;
        this.isExpansion = isExpansion;
        this.expandsGameId = expandsGameId;
        this.expandsName = expandsName;
        this.image = image;
        this.expansions = [];
        this.baseGames = [];
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

