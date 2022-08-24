type HorizontalScroll = {
    scrollValue: number,
    scrollTarget: number,
    scrollLeft: number,
    scrollRight: number,
    spring: number,
    oldValue: number,
}
/**
 * Default values<br>
 * onClick: 200<br>
 * mouseMove: 1<br>
 * onHover: 15<br>
 * onScroll: 1<br>
 * keyPressed: 1
 */
type SpeedOptions = {
    onClick: number,
    mouseMove: number,
    onHover: number,
    onScroll: number,
    keyPressed: number,
}

type EventsOptions = {
    onScroll: boolean,
    onArrowKeyboardPressed: boolean,
    onMouseMove: boolean,
    onArrowHover: boolean,
    onArrowClick: boolean,
}

interface SliderStyleSheet {
    position: string,
    top: string,
    left: string,
    'z-index': string | number,
    'backface-visibility': string,
    'will-change': string,
}

interface ArrowStyleSheet {
    position?: string,
    'justify-content'?: string,
    'align-items'?: string,
    width?: string,
    height?: string,
    top?: string,
    'z-index'?: number,
    cursor?: string,
    display?: string,
}

type Options = {
    selectorForSlider: string,
    selectorLeftArrow?: string,
    selectorRightArrow?: string,
    sliderStyleSheet: SliderStyleSheet,
    speedOptions?: SpeedOptions,
    eventsOptions?: EventsOptions,
    arrowStyle?: ArrowStyleSheet,
}