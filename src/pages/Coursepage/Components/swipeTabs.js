import React, { useState, useMemo } from 'react';
import ReactSwipe from 'react-swipe';
import { Tabs, Tab} from '@material-ui/core';


const SwipeTabs = () => {
    let swiper;
    const [position, setPosition] = useState(0);
  
    const swipeOptions = useMemo(() => ({
        continuous: false,
        callback(e) {
            setPosition(e)
        }
    }), []);
  
    const handleTabChange = (e, newIndex) => {
        setPosition(newIndex);
        swiper.slide(newIndex);
    };
  
    return (
        <main>
            <Tabs value={position} onChange={handleTabChange} centered>
                <Tab label="Kurs"/>
                <Tab label="Seminar"/>
            </Tabs>
            <ReactSwipe id="swipe_tools" swipeOptions={swipeOptions} ref={el => (swiper = el)}>
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

export default SwipeTabs;