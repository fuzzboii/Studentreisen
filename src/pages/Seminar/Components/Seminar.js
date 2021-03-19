// React-spesifikt
import { Component } from "react";

// 3rd-party Packages

// Studentreisen-assets og komponenter
import '../CSS/Seminar.css';
import SeminarOverview from './SeminarOverview';

class Seminar extends Component {

    render() {
        return(
        <main>
            <div className="div_seminar">
                <SeminarOverview />
            </div>

        </main>
        )
    }    
}   



export default Seminar; 