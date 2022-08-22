const deltaFromKey = (key: string): number => {
    let delta = 0;

    switch (key){
        case 'ArrowUp':
        case 'ArrowLeft':
            delta = -100;
            break;

        case 'ArrowDown':
        case 'ArrowRight':
            delta = 100;
            break;

        default:
            return 0;
    }

    return delta;
}