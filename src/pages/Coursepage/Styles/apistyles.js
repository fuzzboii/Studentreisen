import { styled } from '@material-ui/core/styles';
import { makeStyles, withStyles  } from '@material-ui/core/styles';

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';


export const Accordion = withStyles({
    root: {
        borderTop: "1px solid rgb(163, 163, 163)",      
        boxShadow: 'none',
        borderBottom: "1px solid rgb(163, 163, 163)",
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);
  
  export const AccordionSummary = withStyles({
    root: {
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
        borderBottom: "none",
        
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);
  
  export const AccordionDetails = withStyles((theme) => ({
    root: {
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      display: "inherit",
      '&$expanded': {
        borderBottom: "1px solid rgb(163, 163, 163)",        
      },
    },
  }))(MuiAccordionDetails);


export const MyContainer = styled(Container)({

});

//Cards
export const MyCardContent = styled(CardContent)({
    

});


