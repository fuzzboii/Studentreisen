// React-spesifikt
import React from 'react'

// 3rd-party Packages
import { FaChalkboardTeacher, FaUsers, FaFileAlt } from "react-icons/fa";

// Studentreisen-assets og komponenter
import '../CSS/Services.css';

// Komponent for Tjenester/Services delt i 3 deler (Kurs, seminar, CV). Data hentes og endres på Data.js.
function Services({
    heading, subheading, kursDesc, seminarDesc, cvDesc
}) {
    return (
        <div className="services_section">
            <div className="services_wrapper">
                <h1 className="services_heading">{heading}</h1>
                <h2 className="services_subheading">{subheading}</h2>
                <div className="services_container">
                    
                    <div className="services_container-info">
                        <div className="icon">
                            <FaChalkboardTeacher size="3em" />
                        </div>
                        <h3>Kurs</h3>
                        <p>{kursDesc}</p>
                    </div>
            
                    <div className="services_container-info">
                        <div className="icon">
                            <FaUsers size="3em" />
                        </div>
                        <h3>Seminarer</h3>
                        <p>{seminarDesc}</p>
                    </div>
                    
                    <div className="services_container-info">
                        <div className="icon">
                            <FaFileAlt size="3em" />
                        </div>
                        <h3>CV</h3>
                        <p>{cvDesc}</p>
                    </div>                                                                                                                
                </div>
            </div>
        </div>
    );
}

export default Services