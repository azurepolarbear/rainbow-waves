/*
 * Copyright (C) 2015-2024 brittni and the polar bear LLC.
 *
 * This file is a part of brittni and the polar bear's rainbow waves algorithmic art project,
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

import P5Lib from "p5";
import {Point} from "./point";
import {CanvasContext, CanvasRedrawListener, P5Context} from "@batpb/genart";

export class Wave implements CanvasRedrawListener {
    public static readonly MIN_SPEED: number = 0.0001;
    public static readonly MAX_SPEED: number = 1;

    #base: P5Lib.Vector;
    #length: number;
    #amplitude: number;
    #frequency: number;

    /**
     * minimum value = 2
     * maximum value = 1_000
     */
    #pointCount: number;

    #deltaTheta: number;
    readonly #points: Point[] = [];

    static readonly #MIN_POINTS: number = 2;
    static readonly #MAX_POINTS: number = 1_000;

    constructor(base: P5Lib.Vector, pointCount: number, amplitude: number, frequency: number, length: number, speed: number) {
        this.#base = base;
        this.#length = length;
        this.#pointCount = Math.floor(P5Context.p5.constrain(pointCount, Wave.#MIN_POINTS, Wave.#MAX_POINTS));
        this.#deltaTheta = P5Context.p5.constrain(speed, Wave.MIN_SPEED, Wave.MAX_SPEED);
        this.#amplitude = amplitude;
        this.#frequency = frequency;
        this.#buildPoints();
    }

    #buildPoints(): void {
        let theta: number = 0;
        let xSpace: number = (this.#length / this.#pointCount);
        let xOffset: number = xSpace / 2.0;

        for (let i: number = 0; i < this.#pointCount; i++) {
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = this.#base.x + xOffset + (i * xSpace);
            pointBase.y = this.#base.y;
            const point: Point = new Point(pointBase, this.#amplitude, theta, this.#deltaTheta);
            this.#points.push(point);
            theta += ((P5Context.p5.TWO_PI * this.#frequency) / (this.#pointCount - 1));
        }
    }

    canvasRedraw(): void {
        this.#points.forEach((point: Point): void => point.canvasRedraw());
    }

    draw(): void {
        this.#debug_drawFrame();
        this.#points.forEach((pt: Point): void => pt.draw());
    }

    #debug_drawFrame(): void {
        const p5: P5Lib = P5Context.p5;
        p5.stroke(0);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.rectMode(p5.CORNER);
        p5.rect(this.#base.x, this.#base.y - this.#amplitude, this.#length, this.#amplitude * 2);
        p5.line(this.#base.x, this.#base.y, this.#base.x + this.#length, this.#base.y);
    }
}
