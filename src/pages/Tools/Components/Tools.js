// React-spesifikt
import React, {useState, useMemo} from 'react'
import { Component } from "react";

// 3rd-party Packages
import ReactSwipe from 'react-swipe';

// Studentreisen-assets og komponenter
import UserOverview from './UserOverview';
import '../CSS/Tools.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

class Tools extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading : true, authenticated : false, usertype : 1,
            windowWidth : 0,
            activeTool : 0,
        }
    }

    handleWindowResize() {
        this.setState({
            windowWidth: window.innerWidth
        })
    }

    componentDidMount() {
        this.handleWindowResize();
        window.addEventListener('resize', this.handleWindowResize.bind(this));

        // Henter authtoken-cookie
        const token = CookieService.get("authtoken");

        if(token !== undefined) {
            // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
            AuthService.isAuthenticated(token).then(res => {
                if(!res.authenticated) {
                    // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
                    CookieService.remove("authtoken");
                }
                this.setState({
                    authenticated : res.authenticated,
                    usertype : res.usertype,
                    loading: false
                });
            });
        } else {
            this.setState({
                authenticated : false,
                loading: false
            });
        }
    }

    render() {
        const {loading, authenticated, usertype} = this.state;

        if(loading) {
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(!loading && authenticated && usertype === 4) {
            if(this.state.windowWidth < 960) {
                return (
                    <SwipeWAdmin />
                )
            } else {
                if(this.state.activeTool == 0) {
                    return (
                        <UserOverview />
                    )
                } else if(this.state.activeTool == 1) {
                    return (
                        <main>
                            <div>
                                <h1>Kursoversikt</h1>
                            </div>
                        </main>
                    )
                } else if(this.state.activeTool == 2) {
                    return (
                        <main>
                            <div>
                                <h1>Seminaroversikt</h1>
                            </div>
                        </main>
                    )
                }
            }
        } else if(!loading && authenticated) {
            if(this.state.windowWidth < 960) {
                return (
                    <Swipe />
                )
            } else {
                if(this.state.activeTool == 0) {
                    return (
                        <main>
                            <div>
                                <h1>Kursoversikt</h1>
                            </div>
                        </main>
                    )
                } else if(this.state.activeTool == 1) {
                    return (
                        <main>
                            <div>
                                <h1>Seminaroversikt</h1>
                            </div>
                        </main>
                    )
                }
            }
        } else {
            return (
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
            );
        }
    }
}


const Swipe = () => {
    const [position, setPosition] = useState(0);
  
    const swipeOptions = useMemo(() => ({
        continuous: false,
        transitionEnd(e) {
            setPosition(e)
        }
    }), []);

    const changeActiveIndicator = () => {
        switch(position) {
            case 0: 
                return (
                    <section id="tools_indicator">
                        <button className="tools_indicator_btn_active" variant="outlined" />
                        <button className="tools_indicator_btn" variant="outlined" />
                    </section>
                )
            case 1: 
                return (
                    <section id="tools_indicator">
                        <button className="tools_indicator_btn" variant="outlined" />
                        <button className="tools_indicator_btn_active" variant="outlined" />
                    </section>
                )
        }
    }
  
    return (
        <main>
            {changeActiveIndicator()}
            <ReactSwipe id="swipe_tools" swipeOptions={swipeOptions}>
                <div className="div_tools">
                    <section>
                        <h1>Kursoversikt</h1>
                    </section>
                </div>
                <div className="div_tools">
                    <section>
                        <h1>Seminaroversikt</h1>
                    </section>
                </div>
            </ReactSwipe>
        </main>
    );
};

const SwipeWAdmin = () => {
    const [position, setPosition] = useState(0);
  
    const swipeOptions = useMemo(() => ({
        continuous: false,
        transitionEnd(e) {
            setPosition(e)
        }
    }), []);

    const changeActiveIndicator = () => {
        switch(position) {
            case 0: 
                return (
                    <section id="tools_indicator">
                        <button className="tools_indicator_btn_active" variant="outlined" />
                        <button className="tools_indicator_btn" variant="outlined" />
                        <button className="tools_indicator_btn" variant="outlined" />
                    </section>
                )
            case 1: 
                return (
                    <section id="tools_indicator">
                        <button className="tools_indicator_btn" variant="outlined" />
                        <button className="tools_indicator_btn_active" variant="outlined" />
                        <button className="tools_indicator_btn" variant="outlined" />
                    </section>
                )
            case 2: 
                return (
                    <section id="tools_indicator">
                        <button className="tools_indicator_btn" variant="outlined" />
                        <button className="tools_indicator_btn" variant="outlined" />
                        <button className="tools_indicator_btn_active" variant="outlined" />
                    </section>
                )
        }
    }
  
    return (
        <main>
            {changeActiveIndicator()}
            <ReactSwipe id="swipe_tools" swipeOptions={swipeOptions}>
                <div className="div_tools">
                    <UserOverview />
                </div>
                <div className="div_tools">
                    <section>
                        <h1>Kursoversikt</h1>
                    </section>
                </div>
                <div className="div_tools">
                    <section>
                        <h1>Seminaroversikt</h1>
                    </section>
                </div>
            </ReactSwipe>
        </main>
    );
};

export default Tools;