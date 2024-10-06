import React, { useEffect } from 'react';

const ArComponent = () => {
    useEffect(() => {
        // Подключаем AR.js через A-Frame
        const script = document.createElement('script');
        script.src = 'https://aframe.io/releases/1.2.0/aframe.min.js';
        document.head.appendChild(script);

        const arScript = document.createElement('script');
        arScript.src = 'https://cdn.rawgit.com/jeromeetienne/AR.js/1.7.2/aframe/build/aframe-ar.min.js';
        document.head.appendChild(arScript);

        return () => {
            document.head.removeChild(script);
            document.head.removeChild(arScript);
        };
    }, []);

    return (
        <div>
            <a-scene
                embedded
                vr-mode-ui="enabled: false"
                arjs="sourceType: webcam; debugUIEnabled: false;"
            >
                <a-marker preset="hiro">
                    <a-box
                        position="0 0.5 0"
                        material="color: orange;"
                        scale="0.5 0.5 0.5"
                    ></a-box>
                </a-marker>
                <a-entity camera="active: true"></a-entity>
            </a-scene>
        </div>
    );
};

export default ArComponent;
