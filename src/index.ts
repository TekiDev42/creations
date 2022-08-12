"use strict";

import {Slider} from "./classes/slider";

( async (): Promise<void> => {
    document.addEventListener("readystatechange", (): void => {

        if(document.readyState === 'complete'){
            const mediaQuery: MediaQueryList = window.matchMedia('(min-width: 1024px)');

            if ( mediaQuery.matches ) {
                const creations = new Slider({
                    selectorForSlider: '#app',
                    selectorLeftArrow: '#app1',
                    selectorRightArrow: '#app2',
                    sliderStyleSheet: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        'z-index': '999',
                        'backface-visibility': 'hidden',
                        'will-change': 'transform'
                    }
                });
            }
        }

    });
})();