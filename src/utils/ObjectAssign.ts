export const Assign = <StyleType>(element: HTMLElement, source: StyleType): void => {
    Object.assign(element.style, source);
}