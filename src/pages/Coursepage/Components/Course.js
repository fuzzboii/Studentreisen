import React from "react";
import { MyButton, MyCard, MyCardActions, MyCardActionArea, MyCardContent, MyCardMedia, MyTypography } from '../Styles/apistyles';

const Course = (props) => {

    return (
        <MyCard>
            <MyCardActionArea>
                <MyCardMedia/>
                <MyCardContent>
                    <MyTypography gutterBottom variant="h5" component="h2">
                        Lizard
          </MyTypography>
                    <MyTypography variant="body2" color="textSecondary" component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
          </MyTypography>
                </MyCardContent>
            </MyCardActionArea>
            <MyCardActions>
                <MyButton size="small" color="primary">
                    Share
                    </MyButton>
                <MyButton size="small" color="primary">
                    Learn More
                </MyButton>
            </MyCardActions>
        </MyCard>


    );
};

export default Course;