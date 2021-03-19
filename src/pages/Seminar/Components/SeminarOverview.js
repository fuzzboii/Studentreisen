import { Component } from 'react';
import {SeminarProvider} from './SeminarContext';
import SeminarList from './SeminarList';


class SeminarOverview extends Component {

    render() {
        return (
            <div className="content-seminar">
                <SeminarProvider>
                   <SeminarList/>
                </SeminarProvider>
            </div>
        );
    }    
}   


export default SeminarOverview; 