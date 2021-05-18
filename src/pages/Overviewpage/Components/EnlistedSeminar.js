// React spesifikt
import React from 'react';
import {Link} from 'react-router-dom';

// Material UI komponenter
import ArrowForwardIosSharpIcon from '@material-ui/icons/ArrowForwardIosSharp';
import {makeStyles} from '@material-ui/core/styles';

// 3rd-party Packages
import moment from 'moment';
import 'moment/locale/nb';

// Styling for Material Design komponenter
const useStyles = makeStyles((theme) => ({
    icon: {
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
    },
  }));

// Komponent for å rendrere et enkelt påmeldt seminar i seminarlisten, data'en blir overført fra EnlistedList
const EnlistedSeminar = (props) => {

    // Hook for å få tilgang på styling
    const classes = useStyles();

    return(
        <div className="borderWrap" component={Link} to={`/seminar/seminarkommende=${props.id}`}>
            <Link className='link' to={`/seminar/seminarkommende=${props.id}`}>
                <div className="eventbox">
                    <div className="barColor"></div>
                    <div className="dateBox">
                        <div className="dateWrap">
                            <span className="dateDay">{moment.locale('nb'), moment(props.dato).format("DD")}</span>
                        </div>
                        <span className="dateMonth">{moment.locale('nb'), moment(props.dato).format("MMM")}</span>
                    </div>
                    <div className="titleText">
                        <p className="name">{props.navn}</p>
                        <p className="adress">{props.adresse}</p>
                    </div>
                    <ArrowForwardIosSharpIcon className={classes.icon}/>
                </div>
            </Link>
        </div>
    );
};

export default EnlistedSeminar;