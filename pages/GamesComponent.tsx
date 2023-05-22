import React from 'react';
import {Game} from '@/pages/game';
// import GameAccordianComponent from "@/pages/GameAccordianComponent";
import GameComponent from "@/pages/GameComponent";
import {Box, Grid} from "@mui/material";

interface GamesComponentProps {
    games: Game[];
}

const GamesComponent: React.FC<GamesComponentProps> = ({games}) => {
    return (
        <div style={{maxWidth: "100%", paddingTop: "12px"}}>
            <Grid container spacing={0} justifyContent={"center"} alignContent={"center"} border={1}>
                {/*{games.filter(value => !value.isExpansion).map((game) => (*/}
                {games.map((game) => (
                    <div>
                        <Grid item xs={12}>
                            <GameComponent game={game}/>
                        </Grid>
                    </div>
                ))}
            </Grid>
        </div>
    );
}

export default GamesComponent;
