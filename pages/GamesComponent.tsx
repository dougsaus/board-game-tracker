import React from 'react';
import {Game} from '@/pages/game';
import he from 'he';

interface GamesComponentProps {
    games: Game[];
}

const GamesComponent: React.FC<GamesComponentProps> = ({games}) => {
    return (
        <div>
            {games.map((game) => (
                <div key={game.gameId}>
                    <div>
                        <img src={game.image} alt={game.name} style={{width: '100px', height: 'auto'}}/>
                    </div>
                    <div>{game.name}</div>
                    <div style={{maxWidth: '600px', wordWrap: 'break-word'}}>
                        {game.description && he.decode(game.description)}
                    </div>
                    <hr/>
                </div>
            ))}
        </div>
    );
};

export default GamesComponent;
