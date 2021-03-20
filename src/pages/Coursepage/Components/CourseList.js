import React, { useState, useContext } from 'react';
import Course from './Course';
import { CourseContext } from './CourseContext';

const CourseList = () => {
    const [courses, setCourses] = useContext(CourseContext);

    return (
        <div>
            {courses.map(course => (
                <Course emnekode={course.emnekode} navn={course.navn} beskrivelse={course.beskrivelse} semester={course.semester} studiepoeng={course.studiepoeng} lenke={course.lenke} />
            ))}
        </div>
    );
}

export default CourseList;