import React, { Component } from 'react';
import PulseLoader from "react-spinners/PulseLoader";

class Loader extends Component {
    render() {
        return <PulseLoader color="#4646a5"/>;
    }
}

export default Loader;