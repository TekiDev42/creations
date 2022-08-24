"use strict";

import {Slider} from "./classes/slider";

( async (): Promise<void> => {
    document.addEventListener("readystatechange", (): void => {

        if(document.readyState === 'complete'){
            const mediaQuery: MediaQueryList = window.matchMedia('(min-width: 1024px)');

            if ( mediaQuery.matches ) {
                new Slider({
                    selectorForSlider: '#slider',
                    // selectorLeftArrow?: string,
                    // selectorRightArrow?: string,
                    sliderStyleSheet: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        'z-index': '0',
                        'backface-visibility': 'hidden',
                        'will-change': 'transform'
                    },
                    // speedOptions: {}
                    // eventOptions: {}
                    // arrowStyle: {}
                });
            }
        }
    });
})();