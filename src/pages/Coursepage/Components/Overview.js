import { Component } from 'react';
import {CourseProvider} from './CourseContext';
import CourseNav from './CourseNav';
import '../Styles/courseStyles.css';


class Overview extends Component {


    render() {
        return (
            <div className="content-overview">
                
                <CourseProvider>
                    <CourseNav/>

                </CourseProvider>
            </div>
        );
    }    
}   


export default Overview; 