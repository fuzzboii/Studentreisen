import { Component } from 'react';
import {SeminarProvider, SeminarFullfortProvider} from './SeminarContext';
import SeminarNav from './SeminarNav';
import '../CSS/Seminar.css'; 

class SeminarOverview extends Component {

    render() {
        return (
            <div className="content-seminar">
                <SeminarFullfortProvider>
                  <SeminarProvider>
                    <SeminarNav/>
                  </SeminarProvider>
                </SeminarFullfortProvider>

            </div>
        );
    }    
}   


export default SeminarOverview; 