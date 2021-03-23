import { Component } from 'react';
import {CourseProvider} from './CourseContext';
import CourseList from './CourseList';
import '../Styles/courseStyles.css';

class Overview extends Component {

    render() {
        return (
            <div className="content-overview">
                <h1>Kurs</h1>

                <CourseProvider>
                    <div className="boxlink"></div>
                   <CourseList/>
                </CourseProvider>
            </div>
        );
    }    
}   


export default Overview; 