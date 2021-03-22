import { Component } from 'react';
import {CourseProvider} from './CourseContext';
import CourseList from './CourseList';
import {MyButton} from '../Styles/apistyles';

class Overview extends Component {

    render() {
        return (
            <div className="content-overview">
                <h1>Kurs</h1>
                
                <MyButton>Jeg er en knapp</MyButton>

                <CourseProvider>
                   <CourseList/>
                </CourseProvider>
            </div>
        );
    }    
}   


export default Overview; 