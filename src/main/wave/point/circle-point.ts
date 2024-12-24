/*
 * Copyright (C) 2024 brittni and the polar bear LLC.
 *
 * This file is a part of azurepolarbear's rainbow waves algorithmic art project,
 * which is released under the GNU Affero General Public License, Version 3.0.
 * You may not use this file except in compliance with the license.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. See LICENSE or go to
 * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * The visual outputs of this source code are licensed under the
 * Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
 * You should have received a copy of the CC BY-NC-ND 4.0 License with this program.
 * See OUTPUT-LICENSE or go to https://creativecommons.org/licenses/by-nc-nd/4.0/
 * for full license details.
 */

import P5Lib from 'p5';

import { CanvasRedrawListener, Coordinate, CoordinateMode, GeometryStyle, P5Context } from '@batpb/genart';

export interface CirclePointConfig {
    readonly x_A: P5Lib.Vector;
    readonly x_B: P5Lib.Vector;
    readonly coordinateMode: CoordinateMode;
    readonly style: GeometryStyle;
    readonly amplitude: number;
    readonly theta: number;
    readonly deltaTheta: number;
}

export class CirclePoint  implements CanvasRedrawListener{
    #coordinate_A: Coordinate;
    #coordinate_B: Coordinate;
    #style: GeometryStyle;

    // #deltaTheta: number;
    // #strokeMultiplier: number;
    #theta: number;
    #amplitude: number;

    #center: P5Lib.Vector;
    #diameter: number;

    public constructor(config: CirclePointConfig) {
        const p5: P5Lib = P5Context.p5;
        this.#coordinate_A = new Coordinate();
        this.#coordinate_A.setPosition(config.x_A, config.coordinateMode);
        this.#coordinate_B = new Coordinate();
        this.#coordinate_B.setPosition(config.x_B, config.coordinateMode);

        this.#style = config.style;

        this.#theta = config.theta;
        this.#amplitude = config.amplitude;
        // this.#deltaTheta = config.deltaTheta;

        this.#coordinate_A.setPosition(config.x_A, config.coordinateMode);
        this.#coordinate_B.setPosition(config.x_B, config.coordinateMode);
        this.#center = p5.createVector();
        this.#diameter = 0;
        this.#updateCenter()
        this.#updateDiameter();
    }

    public canvasRedraw(): void {
        this.#coordinate_A.remap();
        this.#coordinate_B.remap();
        this.#updateCenter();
        this.#updateDiameter();
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.push();
        this.#style.applyStyle();
        p5.translate(this.#center.x, this.#center.y);
        p5.ellipse(0, 0, this.#diameter, this.#diameter);
        p5.pop();
    }

    #updateCenter(): void {
        const x_A: number = this.#coordinate_A.getX(CoordinateMode.CANVAS);
        const x_B: number = this.#coordinate_B.getX(CoordinateMode.CANVAS);
        const centerX: number = (x_A + x_B) / 2;
        const centerY: number = this.#calculateY();
        this.#center.set(centerX, centerY);
    }

    #calculateY(): number {
        return (this.#coordinate_A.getY(CoordinateMode.CANVAS) + ((Math.sin(this.#theta) * this.#amplitude)));
    }

    #updateDiameter(): void {
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        const a: P5Lib.Vector = P5Context.p5.createVector(this.#coordinate_A.getX(mode), this.#coordinate_A.getY(mode));
        const b: P5Lib.Vector = P5Context.p5.createVector(this.#coordinate_B.getX(mode), this.#coordinate_B.getY(mode));
        this.#diameter = a.dist(b);
    }
}
