type calculateValues = {
    target: number
    left: number
    right: number
}

export const calculateTarget = (delta: number, {target, left, right}: calculateValues): number => {
    const min = Math.min(target, right);
    const max = Math.max(left, min);
    return Math.round(max);
}