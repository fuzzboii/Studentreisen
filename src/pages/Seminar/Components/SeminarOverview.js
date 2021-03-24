import { Component } from 'react';
import {SeminarProvider} from './SeminarContext';
import SeminarNav from './SeminarNav';
import '../CSS/Seminar.css'; 

class SeminarOverview extends Component {

    render() {
        return (
            <div className="content-seminar">
                <SeminarProvider>
                  <SeminarNav/>
                </SeminarProvider>
            </div>
        );
    }    
}   


export default SeminarOverview; 