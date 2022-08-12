type Options = {
    selectorForSlider: string,
    selectorLeftArrow: string,
    selectorRightArrow: string
}

type HorizontalScroll = {
    scrollValue: number,
    scrollTarget: number,
    scrollLeft: number,
    scrollRight: number,
    spring: number,
    oldValue: number,
}