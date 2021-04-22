import {Link} from 'react-router-dom';
import Course from './Course';

const CourseList = ({courses}) => { 

    return (
        <div className="course-list">
            {courses.map((course,index) => (               
                <Link key={index} className='link' to={`/course/emnekode=${course.emnekode}`}>
                    <Course emnekode={course.emnekode} navn={course.navn} beskrivelse={course.beskrivelse} språk={course.språk} semester={course.semester} studiepoeng={course.studiepoeng} lenke={course.lenke}/>
                </Link>     
            ))}
        </div>
    );
}

export default CourseList;