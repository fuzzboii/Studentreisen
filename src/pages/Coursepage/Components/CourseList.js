import React, { useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import Course from './Course';
import CourseDetail from './CourseDetail';
import { CourseContext } from './CourseContext';
import '../Styles/courseStyles.css';

const CourseList = () => {
    const [courses, setCourses] = useContext(CourseContext);

    return (
        <div className="course-list">
            {courses.map(course => (               
                <Link className='link' to={`/course/${course.emnekode}`}>
                    <Course emnekode={course.emnekode} navn={course.navn} beskrivelse={course.beskrivelse} språk={course.språk} semester={course.semester} studiepoeng={course.studiepoeng} lenke={course.lenke}/>
                </Link>     
            ))}
        </div>
    );
}

export default CourseList;