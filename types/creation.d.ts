type HorizontalScroll = {
    scrollValue: number,
    scrollTarget: number,
    scrollLeft: number,
    scrollRight: number,
    spring: number,
    oldValue: number,
}

interface SliderStyleSheet {
    position: string,
    top: string,
    left: string,
    'z-index': string | number,
    'backface-visibility': string,
    'will-change': string,
}

type Options = {
    selectorForSlider: string,
    selectorLeftArrow?: string,
    selectorRightArrow?: string,
    sliderStyleSheet: SliderStyleSheet
}