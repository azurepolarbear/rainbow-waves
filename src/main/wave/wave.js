/* 
This code and its output are licensed under the
Creative Commons Attribution-NonCommercial-NoDerivatives 
4.0 International (CC BY-NC-ND 4.0) License.
https://creativecommons.org/licenses/by-nc-nd/4.0/
*/

// Rainbow Waves
// Wave Class
// Author: Brittni Watkins

class Wave {
    constructor(basePercentages, amplitudePercentage, frequency, numPoints, speed) {
        this.basePercentages = basePercentages.copy();
        this.length = width;
        this.amplitudePercentage = amplitudePercentage;
        this.frequency = frequency;
        this.numPoints = numPoints;
        this.speed = speed;
        this.points = this.createPoints();
        this.colorGenerator = null;
        this.colorMapType = "";
    }

    setColorGenerator(colorGenerator) {
        this.colorGenerator = colorGenerator;
        this.setColors();
    }

    setColorMapType(colorMapType) {
        this.colorMapType = colorMapType;
    }

    display() {
        this.points.forEach(point => {
            point.display();
        });
    }

    resize() {
        this.points.forEach((point, index) => {
            this.length = width;
            let x = this.calculateX(index);
            let position = createVector(x, this.calculateY());
            point.setPosition(position);
            point.setAmplitude(this.calculateAmplitude());
        })
    }

    move() {
        this.points.forEach((point) => {
            point.move();
        });
    }

    createPoints() {
        let points = [];
        let theta = 0;

        for (let i = 0; i < this.numPoints; i++) {
            let x = this.calculateX(i);
            let point = new Point(createVector(x, this.calculateY()), theta, this.calculateAmplitude(), this.speed);
            points.push(point);
            theta += (TWO_PI * this.frequency) / this.numPoints;

            if (theta > TWO_PI) {
                theta = theta % TWO_PI;
            }
        }

        return points;
    }

    calculateX(index) {
        let x = ((index + 1) * (this.length / this.numPoints)) + this.basePercentages.x;
        return x;
    }

    calculateY() {
        return this.basePercentages.y * height;
    }

    calculateAmplitude() {
        return this.amplitudePercentage * height;
    }

    setColors() {
        this.points.forEach((point, index) => {
            let c;

            if (this.colorMapType === "TWO_PI") {
                c = new Color(this.colorGenerator.mapColor(point.getTheta(), 0, TWO_PI, 360, 360));
            } else {
                c = new Color(this.colorGenerator.mapColor(index, 0, this.numPoints, 360, 360));
            }
            
            point.setColor(c);
        });
    }
}
