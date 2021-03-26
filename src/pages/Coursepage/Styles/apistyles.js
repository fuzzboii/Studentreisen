import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';


import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';


export const useStyles = makeStyles({
    root: {
        background: '#3bafa2',
        border: 0,
        borderRadius: 3,
        color: 'white',
        height: 48,
        padding: '0 30px',
      }, "&:hover": {
          color:"#3bafa2"
      }
});


export const MyContainer = styled(Container)({

});

//Cards
export const MyCardContent = styled(CardContent)({
    

});


