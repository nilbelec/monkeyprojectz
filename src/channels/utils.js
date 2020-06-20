
function getMousePos(evt) {
    return {
        x: evt.clientX,
        y: evt.clientY
    };
}

function getRandomColor() {
    const R = Math.floor(Math.random() * 255);
    const G = Math.floor(Math.random() * 255);
    const B = Math.floor(Math.random() * 255);
    return `rgba(${R},${G},${B}, .7)`;
}

export { getMousePos, getRandomColor }