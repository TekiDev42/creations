import {calculateTarget} from "../utils/calculateTarget";
import {Assign} from "../utils/ObjectAssign";
import {Arrow} from "./Arrow";

export class Slider {
    slider: HTMLElement;
    leftArrow: Arrow;
    rightArrow: Arrow;

    raf: number = 0; /** RequestAnimationFrame */
    arrowHoverRAF: number = 0; /** RequestAnimationFrame */

    isDown: boolean = false;

    horizontalScroll: HorizontalScroll = {
        scrollValue: 0,
        scrollTarget: 0,
        scrollLeft: 0,
        scrollRight: 0,
        spring: 0.07,
        oldValue: 0,
    }

    constructor(options: Options) {
        const slider = document.querySelector<HTMLElement>(options.selectorForSlider);

        if(!slider){
            throw Error("Slider element doesn't exist");
        }

        this.slider = slider;
        this.leftArrow = new Arrow(options.selectorLeftArrow ?? '','left', this);
        this.rightArrow = new Arrow(options.selectorRightArrow ?? '', 'right', this);

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

        this.rightArrow.
            arrowElement?.
            addEventListener('click', () => this.arrowClicked(this.rightArrow.direction));

        this.rightArrow.
            arrowElement?.
            addEventListener('mouseenter', () => this.arrowHover(this.rightArrow.direction));

        this.rightArrow.arrowElement?.addEventListener('mouseleave', () => this.stopRAF());

        this.leftArrow.
            arrowElement?.
            addEventListener('click', () => this.arrowClicked(this.leftArrow.direction));

        this.leftArrow.
            arrowElement?.
            addEventListener('mouseenter', () => this.arrowHover(this.leftArrow.direction));

        this.leftArrow.arrowElement?.addEventListener('mouseleave', () => this.stopRAF());
    }

    // UPDATES

    _updateSlider = (): void => {
        if(!this.slider || ! this.slider.isConnected) throw Error("Slider element doesn't exist");

        this._updateValue();
        this.changeDisplayArrow()

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

    arrowClicked = (sens: number): void => {
        let delta = 200 * sens;

        this._updateTarget(delta);

        if(!this.raf) {
            this.raf = requestAnimationFrame(this._updateSlider);
        }
    }

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

    stopRAF = () => {
        cancelAnimationFrame(this.arrowHoverRAF);
        this.arrowHoverRAF = 0;
    }

    arrowHover = (sens: number) => {
        if(this.arrowHoverRAF) {
            return;
        }

        const animation = () => {
            if( ! this.arrowHoverRAF ) {
                this.stopRAF();
                return;
            }

            let delta = 15 * sens;
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
        let rightDisplay = 'flex';

        if( this.horizontalScroll.scrollValue >= 1){
            leftDisplay = 'flex';
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