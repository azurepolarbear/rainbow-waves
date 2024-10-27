/* 
This code and its output are licensed under the
Creative Commons Attribution-NonCommercial-NoDerivatives 
4.0 International (CC BY-NC-ND 4.0) License.
https://creativecommons.org/licenses/by-nc-nd/4.0/
*/

// Rainbow Waves
// Sketch Functions
// Author: Brittni Watkins

let waves = [];
let backgroundColor;
let hasSameNumPoints;
let hasSameAmplitude;
let hasSameFrequency;
let hasSameColorGenerator;
let hasSameColorMapType;
let isSaved;
let yPercentages = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    backgroundColor = randomInt(0, 255);
    setBooleans();
    createWaves();
    setDocumentBackground();
    isSaved = false;
}

function draw() {
    drawBackground();
    waves.forEach((wave) => {
        wave.display();
        wave.move();
    });

    if (!isSaved) {
        if (window.OneOfX) {
            window.OneOfX.save({
                "Background Type": getBackgroundType(),
                "Constant Number of Points": hasSameNumPoints,
                "Constant Amplitude": hasSameAmplitude,
                "Constant Frequency": hasSameFrequency,
                "Constant Color Generator": hasSameColorGenerator
            });

            isSaved = true;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    waves.forEach((wave) => {
        wave.resize();
    });
}

function drawBackground() {
    colorMode(RGB, 255);
    fill(backgroundColor, 10);
    rect(-5, -5, width + 10, height + 10);
}

function setBooleans() {
    hasSameNumPoints = randomBoolean();
    hasSameAmplitude = randomBoolean();
    hasSameFrequency = randomBoolean();
    hasSameColorGenerator = randomBoolean();
    hasSameColorMapType = randomBoolean();
}

function createWaves() {
    let numPoints = randomInt(10, 200);
    let amplitudePercentage = randomFloat(0.01, 0.125);
    let frequency = randomInt(1, 10);
    let startXPercentage = 0;
    let currentYPercentage = 0;
    let yBufferPercentage = 0.01;
    let speed = randomFloat(0.005, 0.1);
    let colorGeneratorFactory = getRandomColorGeneratorFactory();
    let colorGenerator = colorGeneratorFactory.getColorGenerator();
    let colorMapType = getRandomColorMapType();

    while (currentYPercentage < 1) {
        if (!hasSameNumPoints) {
            numPoints = randomInt(10, 200);
        }

        if (!hasSameAmplitude) {
            amplitudePercentage = randomFloat(0.01, 0.125);
        }

        if (!hasSameFrequency) {
            frequency = randomInt(1, 10);
        }

        if (!hasSameColorGenerator) {
            colorGenerator = colorGeneratorFactory.getColorGenerator();
        }

        if (!hasSameColorMapType) {
            colorMapType = getRandomColorMapType();
        }

        let y = currentYPercentage + amplitudePercentage + yBufferPercentage;
        let basePercentages = createVector(startXPercentage, y);
        let wave = new Wave(basePercentages, amplitudePercentage, frequency, numPoints, speed);
        wave.setColorMapType(colorMapType);
        wave.setColorGenerator(colorGenerator);
        waves.push(wave);
        currentYPercentage += (amplitudePercentage * 2) + yBufferPercentage;
    }
}

function getRandomColorGeneratorFactory() {
    let r = randomInt(0, 3);
    let colorGeneratorFactory;

    switch (r % 3) {
        case 1:
            colorGeneratorFactory = new UniformRGBColorGeneratorFactory();
            break;
        case 2:
            colorGeneratorFactory = new UniformHSBColorGeneratorFactory();
            break;
        default:
            colorGeneratorFactory = new UniformColorGeneratorFactory();
            break;
    }

    return colorGeneratorFactory;
}

function getRandomColorMapType() {
    let boolean = randomBoolean();
    let type = "TWO_PI";

    if (boolean) {
        type = "NUM_POINTS";
    }

    return type;
}

function getBackgroundType() {
    let backgroundType;

    if (backgroundColor <= 50) {
        backgroundType = "dark";
    } else if (backgroundColor <= 200) {
        backgroundType = "gray";
    } else {
        backgroundType = "light";
    }

    return backgroundType;
}

function getHasSameNumPoints() {
    return hasSameNumPoints;
}

function setDocumentBackground() {
    document.body.style.backgroundColor = buildRGBBackgroundString();
}

function buildRGBBackgroundString() {
    let values = [backgroundColor, backgroundColor, backgroundColor];
    let rgbString = "rgb(" + values.join(",") + ")";
    return rgbString;
}
