export class Arrow {
    arrowHoverRAF: number | null = null; /** RequestAnimationFrame */
    arrowElement: HTMLElement | null = null;

    constructor(selector: string) {
        const _element = document.querySelector(selector);
        if(_element)
            this.arrowElement = _element;
        else
            this.arrowElement = document.createElement('div');
    }
}