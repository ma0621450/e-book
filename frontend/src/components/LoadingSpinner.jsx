import React from "react";
import { Vortex } from "react-loader-spinner";

const LoadingSpinner = () => {
    return (
        <center>
            <Vortex
                visible={true}
                height="120"
                width="120"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={["red", "green", "blue", "yellow", "orange", "purple"]}
            />
        </center>
    );
};

export default LoadingSpinner;
