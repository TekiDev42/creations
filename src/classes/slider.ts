import {calculateTarget} from "../utils/calculateTarget";
import {Assign} from "../utils/ObjectAssign";
import {deltaFromKey} from "../utils/deltaFromKey";

import * as DefaultOptions from '../options/slider';

import {Arrow} from "./Arrow";

export class Slider {
    slider: HTMLElement;
    leftArrow: Arrow;
    rightArrow: Arrow;

    raf: number = 0; /** RequestAnimationFrame */
    arrowHoverRAF: number = 0; /** RequestAnimationFrame */

    isDown: boolean = false;

    horizontalScroll = DefaultOptions.horizontalScroll
    speedOptions = DefaultOptions.speedOptions
    eventOptions = DefaultOptions.eventsOptions

    constructor(options: Options) {
        const slider = document.querySelector<HTMLElement>(options.selectorForSlider);

        if(!slider){
            throw Error("Slider element doesn't exist");
        }

        this.slider = slider;
        this.leftArrow = new Arrow(options.selectorLeftArrow ?? '','left', this);
        this.rightArrow = new Arrow(options.selectorRightArrow ?? '', 'right', this);

        /**
         * Adding properties without removing what's in the Style attribute, maybe?
         */
        Assign<SliderStyleSheet>(this.slider, options.sliderStyleSheet);

        if (options.speedOptions){
            this.speedOptions = options.speedOptions;
        }

        if (options.eventsOptions){
            this.eventOptions = options.eventsOptions;
        }

        this.horizontalScroll.scrollRight = this.slider.getBoundingClientRect().width - window.innerWidth;
        this._events();
    }

    _events = (): void => {
        /**
         * wheel
         */
        if(this.eventOptions.onScroll)
            this.slider.addEventListener('wheel', this.replaceVerticalScrollByHorizontal );

        /**
         * keydown
         */
        if(this.eventOptions.onArrowKeyboardPressed)
            window.addEventListener('keydown', this.arrowsKeysPressed );

        /**
         * mousedown + mousemove
         */
        if(this.eventOptions.onMouseMove){
            this.slider.addEventListener('mousedown', () => this.isDown = true );
            this.slider.addEventListener('mouseup', () => this.isDown = false );
            this.slider.addEventListener('mousemove', this.mouseMove);
        }

        /**
         * On click on Right Arrow
         */
        if(this.eventOptions.onArrowClick)
            this.rightArrow.
                arrowElement?.
                addEventListener('click', () => this.arrowClicked(this.rightArrow.direction));
        /**
         * On click on Left Arrow
         */
        if(this.eventOptions.onArrowClick)
            this.leftArrow.
            arrowElement?.
            addEventListener('click', () => this.arrowClicked(this.leftArrow.direction));

        /**
         * On hover on Right arrow
         */
        if(this.eventOptions.onArrowHover){
            this.rightArrow.
            arrowElement?.
            addEventListener('mouseenter', () => this.arrowHover(this.rightArrow.direction));

            this.rightArrow.arrowElement?.addEventListener('mouseleave', () => this.stopRAF());
        }
        /**
         * On hover on Left arrow
         */
        if(this.eventOptions.onArrowHover){
            this.leftArrow.
                arrowElement?.
                addEventListener('mouseenter', () => this.arrowHover(this.leftArrow.direction));

            this.leftArrow.arrowElement?.addEventListener('mouseleave', () => this.stopRAF());
        }
    }

    // UPDATES

    _updateSlider = (): void => {
        if(!this.slider || ! this.slider.isConnected) throw Error("Slider element doesn't exist");

        this._updateValue();
        this.changeDisplayArrow();

        if(this.horizontalScroll.scrollValue === this.horizontalScroll.oldValue) {
            if(this.raf) {
                cancelAnimationFrame(this.raf);
                this.raf = 0;
            }
            return;
        }

        this.slider.style['transform'] = `translate3d(-${this.horizontalScroll.scrollValue}px, 0 ,0)`;
        this.horizontalScroll.oldValue = this.horizontalScroll.scrollValue;
        this.raf = requestAnimationFrame(this._updateSlider);
    }

    _updateTarget = (delta: number): void => {
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


    // EVENTS

    arrowClicked = (direction: number): void => {
        let delta = this.speedOptions.onClick * direction;

        this._updateTarget(delta);

        if(!this.raf) {
            this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    arrowsKeysPressed = (event: KeyboardEvent): void => {
        const delta = deltaFromKey(event.key);
        this._updateTarget(delta * this.speedOptions.keyPressed);

        if(!this.raf) {
            this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    arrowHover = (direction: number) => {
        if(this.arrowHoverRAF) {
            return;
        }

        const animation = () => {
            if( ! this.arrowHoverRAF ) {
                this.stopRAF();
                return;
            }

            let delta = this.speedOptions.onHover * direction;
            this._updateTarget(delta);
            this.arrowHoverRAF = requestAnimationFrame(animation)
        }

        this.arrowHoverRAF = requestAnimationFrame(animation)

        if(!this.raf) {
            this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    mouseMove = (event: MouseEvent): void => {
        if (this.isDown){
            let delta = (event.movementX * -1) * this.speedOptions.mouseMove;
            this._updateTarget(delta);

            if(!this.raf) this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    replaceVerticalScrollByHorizontal = ( event: WheelEvent ): void => {
        this._updateTarget(event.deltaY * this.speedOptions.onScroll);

        if(!this.raf) this.raf = requestAnimationFrame(this._updateSlider);
    }

    /**
     * OTHERS
     */
    changeDisplayArrow = (): void => {
        if(!this.leftArrow || ! this.rightArrow) return;

        let leftDisplay = 'none';
        let rightDisplay = 'flex';

        if( this.horizontalScroll.scrollValue >= 1){
            leftDisplay = 'flex';
        }

        if( this.horizontalScroll.scrollValue >= (this.horizontalScroll.scrollRight - 1)){
            rightDisplay = 'none';
        }

        Assign<ArrowStyleSheet>(this.leftArrow.arrowElement, {
            display: leftDisplay
        });

        Assign<ArrowStyleSheet>(this.rightArrow.arrowElement, {
            display: rightDisplay
        });
    }

    stopRAF = (): void => {
        cancelAnimationFrame(this.arrowHoverRAF);
        this.arrowHoverRAF = 0;
    }
}