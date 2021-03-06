import React from 'react'
import { FaChalkboardTeacher } from "react-icons/fa";
import '../CSS/Services.css';



function Services() {
    return (
        <div>
            <div className="services_section">
                <div className="services_wrapper">
                    <h1 className="services_heading">Overskrift</h1>
                        <div className="services_container">
                            <div className="services_container-card">
                                <div className="icon">
                                    <FaChalkboardTeacher size="2em" />
                                </div>
                                <h3>Kortets overskrift</h3>
                                <p>Innhold i kortet</p>
                            </div>                            
                        </div>
                </div>
            </div>
        </div>
    );
}

export default Services