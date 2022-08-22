import {calculateTarget} from "../utils/calculateTarget";
import {Assign} from "../utils/ObjectAssign";
import {Arrow} from "./Arrow";


export class Slider {
    slider: HTMLElement | null = null;
    leftArrow: Arrow;
    rightArrow: Arrow;

    raf: number | null = null; /** RequestAnimationFrame */

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
        this.leftArrow = new Arrow(options.selectorLeftArrow ?? '','left', this);
        this.rightArrow = new Arrow(options.selectorRightArrow ?? '', 'right', this);

        if(!this.slider){
            throw Error("Slider element doesn't exist");
        }

        Assign<SliderStyleSheet>(this.slider, options.sliderStyleSheet);

        this.horizontalScroll.scrollRight = this.slider.getBoundingClientRect().width - window.innerWidth;
        this._events();
    }

    _events = (): void => {
        window.addEventListener('wheel', this.replaceVerticalScrollByHorizontal );
        window.addEventListener('keydown', this.arrowsKeysPressed );

        window.addEventListener('mousedown', () => this.isDown = true );
        window.addEventListener('mouseup', () => this.isDown = false );
        window.addEventListener('mousemove', this.mouseMove);

        this.rightArrow.arrowElement?.addEventListener('click', () => this.arrowClicked(this.rightArrow.direction));
        this.rightArrow.arrowElement?.addEventListener('mouseenter', () => void 0);
        this.rightArrow.arrowElement?.addEventListener('mouseleave', () => void 0);

        this.leftArrow.arrowElement?.addEventListener('click', () => this.arrowClicked(this.leftArrow.direction));
        this.leftArrow.arrowElement?.addEventListener('mouseenter', () => void 0);
        this.leftArrow.arrowElement?.addEventListener('mouseleave', () => void 0);
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

    arrowClicked = (sens: number): void => {
        let delta = 200 * sens;

        this._updateTarget(delta);

        if(!this.raf) {
            this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

    /**
     * EVENTS
     */
    arrowsKeysPressed = (event: KeyboardEvent): void => {
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

    replaceVerticalScrollByHorizontal = ( event: WheelEvent ): void => {
        this._updateTarget(event.deltaY);

        if(!this.raf) this.raf = requestAnimationFrame(this._updateSlider);
    }

    /**
     * OTHERS
     */
    changeDisplayArrow = (): void => {
        if(!this.leftArrow || ! this.rightArrow) return;

        let leftDisplay = 'none';
        let rightDisplay = 'block';

        if( this.horizontalScroll.scrollValue >= 1){
            leftDisplay = 'block';
        }

        if( this.horizontalScroll.scrollValue >= (this.horizontalScroll.scrollRight - 1)){
            rightDisplay = 'none';
        }

        Assign(this.leftArrow.arrowElement, {
            'display': leftDisplay
        });

        Assign(this.rightArrow.arrowElement, {
            'display': rightDisplay
        });
    }
}