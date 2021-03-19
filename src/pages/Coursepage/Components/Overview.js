import { Component } from 'react';
import {CourseProvider} from './CourseContext';
import CourseList from './CourseList';


class Overview extends Component {

    render() {
        return (
            <div className="content-overview">
                <h1>Kurs</h1>
                <CourseProvider>
                   <CourseList/>
                </CourseProvider>
            </div>
        );
    }    
}   


export default Overview; 