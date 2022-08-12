import {calculateTarget} from "../utils/calculateTarget";

export class Creations {
    slider: HTMLElement | null = null;
    leftArrow: HTMLElement | null = null;
    rightArrow: HTMLElement | null = null;

    #raf: number | null = null; /** RequestAnimationFrame */
    #isDown: boolean | null = false;
    #arrowHoverRAF: number | null = null; /** RequestAnimationFrame */

    horizontalScroll: HorizontalScroll = {
        scrollValue: 0,
        scrollTarget: 0,
        scrollLeft: 0,
        scrollRight: 0,
        spring: 0.07,
        oldValue: 0,
    }

    constructor(options: Options) {
        this.slider = document.querySelector<HTMLElement>(options.selectorForSlider);
        this.leftArrow = document.querySelector<HTMLElement>(options.selectorLeftArrow);
        this.rightArrow = document.querySelector<HTMLElement>(options.selectorRightArrow);

        if(!this.slider){
            throw Error("Slider element doesn't exist");
        }

        if(!this.leftArrow){
            throw Error("LeftArrow element doesn't exist");
        }

        if(!this.rightArrow){
            throw Error("RightArrow element doesn't exist");
        }

        Object.assign(this.slider.style ,{
            position: 'absolute',
            top: '0',
            left: '0',
            'z-index': 999,
            'backface-visibility': 'hidden',
            'will-change': 'transform'
        });

        this.horizontalScroll.scrollRight = this.slider.getBoundingClientRect().width - window.innerWidth;
        this.events();
    }

    events(): void{
        window.addEventListener('wheel', this.replaceVerticalScrollByHorizontal.bind(this) );
    }

    updateScroll () {
        if(!this.slider || !this.leftArrow || ! this.rightArrow) return;

        const value = (this.horizontalScroll.scrollTarget - this.horizontalScroll.scrollValue) * this.horizontalScroll.spring
        this.horizontalScroll.scrollValue += parseFloat(value.toFixed(2));

        if( this.horizontalScroll.scrollValue > 0){
            this.leftArrow.setAttribute('style', 'display: block;');
        }

        if ( this.horizontalScroll.scrollValue < 1){
            this.leftArrow.setAttribute('style', 'display: none;');
        }

        if( this.horizontalScroll.scrollValue >= (this.horizontalScroll.scrollRight - 1)){
            this.rightArrow.setAttribute('style', 'display: none;');
        } else {
            this.rightArrow.setAttribute('style', 'display: block;');
        }

        if(this.horizontalScroll.scrollValue === this.horizontalScroll.oldValue) {
            if(this.#raf) {
                cancelAnimationFrame(this.#raf);
                this.#raf = null;
            }
            return;
        }

        this.slider.style['transform'] = `translate3d(-${this.horizontalScroll.scrollValue}px, 0 ,0)`;

        this.horizontalScroll.oldValue = this.horizontalScroll.scrollValue;

        this.#raf = requestAnimationFrame(this.updateScroll.bind(this));
    }

    replaceVerticalScrollByHorizontal ( event: WheelEvent ) {
        this.horizontalScroll.scrollTarget += event.deltaY;
        this.horizontalScroll.scrollTarget = calculateTarget(event.deltaY, {
            target: this.horizontalScroll.scrollTarget,
            left: this.horizontalScroll.scrollLeft,
            right: this.horizontalScroll.scrollRight
        });

        if(!this.#raf) this.#raf = requestAnimationFrame(this.updateScroll.bind(this));
    }
}