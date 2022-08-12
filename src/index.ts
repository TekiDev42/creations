"use strict";

import {Creations} from "./classes/creations";

( async (): Promise<void> => {
    document.addEventListener("readystatechange", (): void => {

        if(document.readyState === 'complete'){
            const mediaQuery: MediaQueryList = window.matchMedia('(min-width: 1024px)');

            if ( mediaQuery.matches ) {
                const creations = new Creations({
                    selectorForSlider: '#app',
                    selectorLeftArrow: '#app1',
                    selectorRightArrow: '#app2'
                });
            }
        }

    });
})();