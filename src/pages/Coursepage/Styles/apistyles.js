
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

export const MyButton = styled(Button)({
 background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});


export const MyContainer = styled(Container)({
    border: 'solid 1px black',
    borderRadius: '10px',
    padding: '1em',
    margin: '2em',
    width: '50%',
});

//Cards
export const MyCard = styled(Card)({
    maxWidth: 345,
});

export const MyCardActionArea = styled(CardActionArea)({

});

export const MyCardActions = styled(CardActions)({
    justifyContent: "flex-end",
    background: "red",

});

export const MyCardContent = styled(CardContent)({

});

export const MyCardMedia = styled(CardMedia)({
    component: "img",
    alt: "Contemplative Reptile",
    height: "140",
});

export const MyTypography = styled(Typography)({

});

