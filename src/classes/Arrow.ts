import {Slider} from "./slider";
import {Assign} from "../utils/ObjectAssign";

import * as Arrows from '../components/arrows';

export class Arrow {
    arrowElement: HTMLElement;

    slider: Slider;
    direction: number = -1;
    arrowStyle: ArrowStyleSheet = {
        position: 'absolute',
        'justify-content': 'center',
        'align-items': 'center',
        width: '50px',
        height: '50px',
        top: 'calc(50% - (50px/2))',
        'z-index': 1,
        cursor: 'pointer',
    }

    constructor(selector: string, direction: string, slider: Slider, arrowStyle?: ArrowStyleSheet) {
        this.slider = slider;
        let _element = null;

        if(selector.length > 0) {
            _element = document.querySelector<HTMLElement>(selector);
        }

        if(arrowStyle){
            this.arrowStyle = arrowStyle;
        }

        if(_element instanceof HTMLElement)
            this.arrowElement = _element;
        else {
            this.arrowElement = this.createArrow(direction);
            this.slider.slider?.parentElement?.append(this.arrowElement)
        }

        this.direction = direction === 'right' ? 1 : -1;
    }

    createArrow = (direction: string): HTMLElement => {
        const arrowElement = document.createElement('div') as HTMLElement;
        arrowElement.id = direction;
        arrowElement.innerHTML = direction === 'left' ? Arrows.left() : Arrows.right();

        const position = direction === 'left' ? {display: 'none', left: '10px'} : {right: '10px'};

        const style = {
            ...this.arrowStyle,
            ...position
        }

        Assign<ArrowStyleSheet>(arrowElement, style);

        return arrowElement;
    }
}