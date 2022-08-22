import {Slider} from "./slider";
import {Assign} from "../utils/ObjectAssign";

export class Arrow {
    // arrowHoverRAF: number | null = null; /** RequestAnimationFrame */
    arrowElement: Element | null = null;

    slider: Slider;
    direction: number = -1;

    constructor(selector: string, direction: string, slider: Slider) {
        this.slider = slider;
        let _element = null;

        if(selector.length > 0) {
            _element = document.querySelector(selector);
        }

        if(_element instanceof Element)
            this.arrowElement = _element;
        else {
            this.arrowElement = this.createArrow(direction);
        }

        this.slider.slider?.parentElement?.append(this.arrowElement)
        this.direction = direction === 'right' ? 1 : -1;
        this.events();
    }

    createArrow = (direction: string): Element => {
        const arrowElement = document.createElement('div');
        arrowElement.id = direction;

        const pos = direction === 'left' ? {left: '10px'} : {right: '10px'};

        const style = {...{
            'position': 'absolute',
            'width': '50px',
            'height': '50px',
            'top': 'calc(50% - (50px/2))',
            'background': 'black',
            'z-index': 1,
        },
        ...pos
        }

        Assign(arrowElement, style);

        return arrowElement;
    }

    events = (): void => {
        this.arrowElement?.addEventListener('click', () => void 0);
        this.arrowElement?.addEventListener('mouseenter', () => void 0);
        this.arrowElement?.addEventListener('mouseleave', () => void 0);
    }

}