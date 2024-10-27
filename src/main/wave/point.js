/* 
This code and its output are licensed under the
Creative Commons Attribution-NonCommercial-NoDerivatives 
4.0 International (CC BY-NC-ND 4.0) License.
https://creativecommons.org/licenses/by-nc-nd/4.0/
*/

// Rainbow Waves
// Point Class
// Author: Brittni Watkins

class Point {
    constructor(base, theta, amplitude, speed) {
        this.base = base.copy();
        this.current = createVector();
        this.theta = theta;
        this.amplitude = amplitude;
        this.speed = speed;
        this.color = null;
        this.calculateCurrent();
    }

    getTheta() {
        return this.theta;
    }

    setColor(color) {
        this.color = color;
    }

    display() {
        stroke(this.color.getColor());
        strokeWeight(5);
        point(this.current);
    }

    move() {
        this.theta += this.speed;

        if (this.theta > TWO_PI) {
            this.theta = this.theta % TWO_PI;
        }

        this.calculateCurrent();
    }

    setPosition(position) {
        this.base.set(position.x, position.y);
        this.calculateCurrent();
    }

    setAmplitude(amplitude) {
        this.amplitude = amplitude;
        this.calculateCurrent();
    }

    calculateCurrent() {
        let x = this.base.x;
        let y = this.calculateY();
        this.current.set(x, y);
    }

    calculateY() {
        let y = this.base.y + (sin(this.theta) * this.amplitude);
        return y;
    }
}
