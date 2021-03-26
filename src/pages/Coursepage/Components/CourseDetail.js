import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import { CourseContext } from './CourseContext';
import { MyCardContent } from '../Styles/apistyles';

import axios from 'axios';
import Box from '@material-ui/core/Box';

// Studentreisen-assets og komponenter
import '../Styles/courseStyles.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';


const CourseDetail = () => {

    useEffect(() => {
        fetchData();
    },[]);

    let { emnekode } = useParams();
    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/");
        console.log(res.data);
        setCourses(res.data);

    };
        return(
            <div className="course-detail">
            {courses.map(course => { if(emnekode === course.emnekode)           
                    return <Box className="box-detail" boxShadow={3}>
                                <MyCardContent>
                                    <div className="courseHeader">
                                        <p>{course.navn}</p>
                                        <p>{course.emnekode}</p>
                                    </div>
                                    <p>{course.beskrivelse}</p>
                                    <p>{course.språk}</p>
                                    <p>{course.semester}</p>
                                    <p>{course.studiepoeng}</p>
                                    <p>{course.lenke}</p>
                                </MyCardContent>
                            </Box>
                        
            })}
            </div>
        );

};

export default CourseDetail;



