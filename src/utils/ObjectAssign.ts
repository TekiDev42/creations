/**
 * Want to keep others properties inside Style attribute
 */
export const Assign = <StyleType>(element: HTMLElement, source: StyleType): void => {
    Object.assign(element.style, source);
}