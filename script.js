let mouseDown = false;
let mode = "color";

document.addEventListener("mousedown", () => {
    mouseDown = true;
});

document.addEventListener("mouseup", () => {
    mouseDown = false;
});

window.addEventListener("blur", () => {
    mouseDown = false;
});

const container = document.getElementById("container");
const slider = document.getElementById("gridSize");
const sizeDisplay = document.querySelector(".pixels span");
const clearBtn = document.getElementById("clearBtn");
const colorBtn = document.getElementById("colorBtn");
const rainbowBtn = document.getElementById("rainbowBtn");
const eraserBtn = document.getElementById("eraserBtn");
const darkenBtn = document.getElementById("darkenBtn");
const lightenBtn = document.getElementById("lightenBtn");
colorBtn.classList.add("active");
const backgroundColorPicker = document.getElementById("backgroundColor");

const modeButtons = [
    colorBtn,
    rainbowBtn,
    darkenBtn,
    lightenBtn,
    eraserBtn
];

function setMode(newMode, button) {

    mode = newMode;

    modeButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}

colorBtn.onclick = () => setMode("color", colorBtn);
rainbowBtn.onclick = () => setMode("rainbow", rainbowBtn);
eraserBtn.onclick = () => setMode("eraser", eraserBtn);
darkenBtn.onclick = () => setMode("darken", darkenBtn);
lightenBtn.onclick = () => setMode("lighten", lightenBtn);

backgroundColorPicker.addEventListener("input", () => {

    const color = backgroundColorPicker.value;
    container.style.backgroundColor = color;

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.style.backgroundColor = color;
    });

});


function createGrid(size) {
    container.style.setProperty("--grid-size", size); // ✅ drives cell sizing
    const bgColor  = backgroundColorPicker.value;
    const fragment = document.createDocumentFragment();
    container.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.backgroundColor = bgColor;
        cell.addEventListener("mouseover", paintCell);
        cell.addEventListener("mousedown", paintCell);
        fragment.appendChild(cell);
    }

    container.appendChild(fragment);
}

// Initial grid
createGrid(16);

// Slider changes grid size
slider.addEventListener("input", () => {
    const size = slider.value;

    sizeDisplay.textContent = `${size} × ${size}`;

    createGrid(size);
});

function paintCell(e) {

    if (!mouseDown && e.type !== "mousedown") return;

    const cell = e.target;
    const penColor = document.getElementById("penColor").value;

    switch(mode) {

        case "color":
            cell.style.backgroundColor = penColor;
            cell.dataset.opacity = 1;
            break;

        case "rainbow":
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            cell.dataset.opacity = 1;
            break;

        case "eraser":
            cell.style.backgroundColor = backgroundColorPicker.value;
            cell.style.opacity = 1;
            cell.dataset.opacity = 1;
            break;

        case "darken":
            darken(cell);
            break;

        case "lighten":
            lighten(cell);
            break;
    }
}

function darken(cell) {
    let color = getComputedStyle(cell).backgroundColor;

    if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
        color = "rgb(255, 255, 255)";
    }

    const rgb = color.match(/\d+/g);

    let r = Math.floor(Number(rgb[0]) * 0.9);
    let g = Math.floor(Number(rgb[1]) * 0.9);
    let b = Math.floor(Number(rgb[2]) * 0.9);

    cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function lighten(cell) {
    let color = getComputedStyle(cell).backgroundColor;

    if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
        color = "rgb(255, 255, 255)";
    }

    const rgb = color.match(/\d+/g);

    let r = Number(rgb[0]);
    let g = Number(rgb[1]);
    let b = Number(rgb[2]);

   const target = hexToRgb(backgroundColorPicker.value);

    r = Math.floor(r + (target.r - r) * 0.1);
    g = Math.floor(g + (target.g - g) * 0.1);
    b = Math.floor(b + (target.b - b) * 0.1);

    cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

// Clear button
clearBtn.addEventListener("click", () => {

    const bgColor = backgroundColorPicker.value;

    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.backgroundColor = bgColor;
    });

});