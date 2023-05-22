import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red, blue} from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Game} from "@/pages/game";
import he from 'he';
import {Grid} from "@mui/material";


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface GameComponentProps {
    game: Game;
}

const GameComponent: React.FC<GameComponentProps> = ({game}) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    console.log(game);
    return (
        <Card sx={{maxWidth: 345}}>
            <CardHeader
                avatar={
                    <Avatar sx={game.isExpansion ? {bgcolor: red[500]} : {bgcolor: blue[500]}} aria-label="recipe">
                        {game.isExpansion ? 'EX' : "BG"}
                    </Avatar>
                }
                title={game.name}
                subheader={game.isExpansion ? `Base Game: ${game.expandsName}` : `Expansions Owned: ${game.expansions.length}`}
            />
            <CardMedia
                component='img'
                height='auto'
                width='auto'
                image={game.image}
                alt={game.name}
            />
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {!game.isExpansion && game.expansions.map(expansion => (
                        <div>
                            <GameComponent game={expansion}/>
                        </div>
                    ))}
                    {game.isExpansion && game.baseGames.map(baseGame => (
                        <div>
                            <GameComponent game={baseGame}/>
                        </div>
                    ))}
                    {/*<Typography variant="body2" color="text.secondary">*/}
                    {/*    {he.decode(game.description)}*/}
                    {/*</Typography>*/}
                </CardContent>
            </Collapse>
        </Card>
    );
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}))

export default GameComponent;