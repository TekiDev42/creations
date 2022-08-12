import {calculateTarget} from "../utils/calculateTarget";
import {Assign} from "../utils/ObjectAssign";

export class Creations {
    slider: HTMLElement | null = null;
    leftArrow: HTMLElement | null = null;
    rightArrow: HTMLElement | null = null;

    raf: number | null = null; /** RequestAnimationFrame */
    arrowHoverRAF: number | null = null; /** RequestAnimationFrame */

    isDown: boolean | null = false;

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

        Assign<SliderStyleSheet>(this.slider, options.sliderStyleSheet);

        this.horizontalScroll.scrollRight = this.slider.getBoundingClientRect().width - window.innerWidth;
        this._events();
    }

    _events = (): void => {
        window.addEventListener('wheel', this.replaceVerticalScrollByHorizontal );
        window.addEventListener('keydown', this.ArrowsPressed );

        window.addEventListener('mousedown', (evt) => this.isDown = true );
        window.addEventListener('mouseup', (evt) => this.isDown = false );
        window.addEventListener('mousemove', this.mouseMove);
    }

    /**
     * UPDATES
     */
    _updateSlider = (): void => {
        if(!this.slider || ! this.slider.isConnected) throw Error("Slider element doesn't exist");

        this._updateValue();
        this.changeDisplayArrow()

        if(this.horizontalScroll.scrollValue === this.horizontalScroll.oldValue) {
            if(this.raf) {
                cancelAnimationFrame(this.raf);
                this.raf = null;
            }
            return;
        }

        this.slider.style['transform'] = `translate3d(-${this.horizontalScroll.scrollValue}px, 0 ,0)`;

        this.horizontalScroll.oldValue = this.horizontalScroll.scrollValue;

        this.raf = requestAnimationFrame(this._updateSlider);
    }

    _updateTarget = (delta: number) => {
        this.horizontalScroll.scrollTarget += delta;

        this.horizontalScroll.scrollTarget = calculateTarget(delta, {
            target: this.horizontalScroll.scrollTarget,
            left: this.horizontalScroll.scrollLeft,
            right: this.horizontalScroll.scrollRight
        });
    }

    _updateValue = (): void => {
        const value = (this.horizontalScroll.scrollTarget - this.horizontalScroll.scrollValue) * this.horizontalScroll.spring
        this.horizontalScroll.scrollValue += parseFloat(value.toFixed(2));
    }

    /**
     * EVENTS
     */
    ArrowsPressed = (event: KeyboardEvent):void => {
        let delta = 0;

        switch (event.key){
            case 'ArrowUp':
            case 'ArrowLeft':
                delta = -100;
                break;

            case 'ArrowDown':
            case 'ArrowRight':
                delta = 100;
                break;

            default:
                return void 0;
        }

        this._updateTarget(delta);

        if(!this.raf) {
            this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    mouseMove = (event: MouseEvent): void => {
        if (this.isDown){
            let delta = event.movementX * -1;
            this._updateTarget(delta);

            if(!this.raf) this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    replaceVerticalScrollByHorizontal = ( event: WheelEvent ):void => {
        this._updateTarget(event.deltaY);

        if(!this.raf) this.raf = requestAnimationFrame(this._updateSlider);
    }

    /**
     * OTHERS
     */
    changeDisplayArrow = (): void => {
        if(!this.leftArrow || ! this.rightArrow) return;

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
    }
}