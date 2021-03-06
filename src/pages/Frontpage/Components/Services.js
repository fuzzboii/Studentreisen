import React from 'react'
import { FaChalkboardTeacher, FaUsers, FaFileAlt } from "react-icons/fa";
import '../CSS/Services.css';



function Services() {
    return (
        <div>
            <div className="services_section">
                <div className="services_wrapper">
                    <h1 className="services_heading">Hva er studentreisen?</h1>
                    <h2 className="services_subheading">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce hendrerit augue nec lorem rutrum, aliquam viverra arcu auctor.</h2>
                        <div className="services_container">
                            <div className="services_container-info">
                                <div className="icon">
                                    <FaChalkboardTeacher size="3em" />
                                </div>
                                <h3>Kurs</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce hendrerit augue nec lorem rutrum, aliquam viverra arcu auctor.</p>
                            </div>
                            <div className="services_container-info">
                                <div className="icon">
                                    <FaUsers size="3em" />
                                </div>
                                <h3>Seminarer</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce hendrerit augue nec lorem rutrum, aliquam viverra arcu auctor.</p>
                            </div>
                            <div className="services_container-info">
                                <div className="icon">
                                    <FaFileAlt size="3em" />
                                </div>
                                <h3>CV</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce hendrerit augue nec lorem rutrum, aliquam viverra arcu auctor.</p>
                            </div>                                                                                                                
                        </div>
                </div>
            </div>
        </div>
    );
}

export default Services