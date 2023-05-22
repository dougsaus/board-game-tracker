import * as React from 'react';
import {IconButtonProps} from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Game} from "@/pages/game";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import he from 'he';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface GameAccordianComponentProps {
    game: Game;
}

const GameAccordianComponent: React.FC<GameAccordianComponentProps> = ({game}) => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    console.log(game);
    return (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography sx={{ width: '100%', flexShrink: 0 }}>
                    {game.name}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    {he.decode(game.description)}
                </Typography>
            </AccordionDetails>
        </Accordion>

        // <Card sx={{maxWidth: 345}}>
        //     <CardHeader
        //         avatar={
        //             <Avatar sx={game.isExpansion?{bgcolor: red[500]}:{bgcolor: blue[500]}} aria-label="recipe">
        //                 {game.isExpansion?'EX':"BG"}
        //             </Avatar>
        //         }
        //         title={game.name}
        //         subheader={game.expandsName}
        //     />
        //     <CardMedia
        //         component='img'
        //         height='auto'
        //         width='auto'
        //         image={game.image}
        //         alt={game.name}
        //     />
        //     {/*<CardContent>*/}
        //     {/*    <Typography variant="body2" color="text.secondary">*/}
        //     {/*        {game.description}*/}
        //     {/*    </Typography>*/}
        //     {/*</CardContent>*/}
        //     <CardActions disableSpacing>
        //         <ExpandMore
        //             expand={expanded}
        //             onClick={handleExpandClick}
        //             aria-expanded={expanded}
        //             aria-label="show more"
        //         >
        //             <ExpandMoreIcon/>
        //         </ExpandMore>
        //     </CardActions>
        //     <Collapse in={expanded} timeout="auto" unmountOnExit>
        //         <CardContent>
        //             <Typography variant="body2" color="text.secondary">
        //                 {he.decode(game.description)}
        //             </Typography>
        //         </CardContent>
        //     </Collapse>
        // </Card>
    );
}

export default GameAccordianComponent;