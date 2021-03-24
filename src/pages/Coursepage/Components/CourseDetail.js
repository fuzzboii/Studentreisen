import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import { CourseContext } from './CourseContext';
import axios from 'axios';

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
            <div>
            {courses.map(course => { if(emnekode === course.emnekode)           
                return <div>
                            <p>{course.emnekode}</p>
                            <p>{course.navn}</p>
                            <p>{course.beskrivelse}</p>
                            <p>{course.språk}</p>
                            <p>{course.semester}</p>
                            <p>{course.studiepoeng}</p>
                            <p>{course.lenke}</p>
                        </div>
            })}
        </div>
        );

};

export default CourseDetail;



