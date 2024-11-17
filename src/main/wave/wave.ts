/*
 * Copyright (C) 2024 brittni and the polar bear LLC.
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

import {
    CanvasContext,
    CanvasRedrawListener,
    Color,
    ColorSelector,
    Coordinate,
    CoordinateMode,
    P5Context
} from "@batpb/genart";
import P5Lib from "p5";
import {Point} from "./point";

class Edge {
    public readonly top: Coordinate = new Coordinate();
    public readonly bottom: Coordinate = new Coordinate();

    public get center(): P5Lib.Vector {
        return P5Lib.Vector.lerp(this.topVector, this.bottomVector, 0.5);
    }

    public get length(): number {
        return P5Lib.Vector.dist(this.topVector, this.bottomVector);
    }

    public get bottomVector(): P5Lib.Vector {
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        return (new P5Lib.Vector(this.bottom.getX(mode), this.bottom.getY(mode)));
    }

    public get topVector(): P5Lib.Vector {
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        return (new P5Lib.Vector(this.top.getX(mode), this.top.getY(mode)));
    }

    public remap(): void {
        this.top.remap();
        this.bottom.remap();
    }
}

// TODO - isMoving boolean
// TODO - random amplitude for each point
// TODO - perlin amplitude for each point
// TODO - random theta for each point

export interface WaveConfig {
    coordinateMode: CoordinateMode;
    edgeA: {top: P5Lib.Vector, bottom: P5Lib.Vector};
    edgeB: {top: P5Lib.Vector, bottom: P5Lib.Vector};
    pointTotal: number;
    frequency: number | Range;
    deltaTheta: number | Range;
    initialTheta: number;
    colorSelector: ColorSelector;
}

export class Wave implements CanvasRedrawListener {
    public static readonly MIN_POINTS: number = 5;
    public static readonly MAX_POINTS: number = 1_000;
    public static readonly MIN_SPEED: number = 0.0001;
    public static readonly MAX_SPEED: number = 1;

    readonly #EDGE_A: Edge = new Edge();
    readonly #EDGE_B: Edge = new Edge();
    readonly #POINTS: Point[] = [];

    #frequency: number = 1;
    #pointCount: number = 25;
    #initialTheta: number = 0;
    #deltaTheta: number = 0.005;
    #rotation: number = 0;
    #colorSelector: ColorSelector | undefined = undefined;

    public constructor(config: WaveConfig) {
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.push();
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        p5.translate(center_A);
        p5.rotate(this.#rotation);
        this.#POINTS.forEach((point: Point): void => point.draw());
        p5.pop();
    }

    public canvasRedraw(): void {
        this.#EDGE_A.remap();
        this.#EDGE_B.remap();
        this.#updateRotation();
        this.updatePoints();
        this.#POINTS.forEach((point: Point): void => point.canvasRedraw());
    }

    /**
     * @deprecated
     */
    public build_setEdge_A(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        // this.#EDGE_A.top.setPosition(top);
        // this.#EDGE_A.bottom.position = bottom;
        // this.#updateRotation();
        return this;
    }

    /**
     * @deprecated
     */
    public build_setEdge_B(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        // this.#EDGE_B.top.position = top;
        // this.#EDGE_B.bottom.position = bottom;
        // this.#updateRotation();
        return this;
    }

    /**
     * @deprecated
     */
    public build_setPointCount(pointCount: number): Wave {
        this.#pointCount = Math.floor(P5Context.p5.constrain(pointCount, Wave.MIN_POINTS, Wave.MAX_POINTS));
        return this;
    }

    /**
     * @deprecated
     */
    public build_setFrequency(frequency: number): Wave {
        this.#frequency = frequency;
        return this;
    }

    /**
     * @deprecated
     */
    public build_setDeltaTheta(deltaTheta: number): Wave {
        this.#deltaTheta = P5Context.p5.constrain(deltaTheta, Wave.MIN_SPEED, Wave.MAX_SPEED);
        return this;
    }

    /**
     * @deprecated
     */
    public build_setInitialTheta(initialTheta: number): Wave {
        this.#initialTheta = initialTheta % (Math.PI * 2);
        return this;
    }

    /**
     * @deprecated
     */
    public build_setColorSelector(selector: ColorSelector): Wave {
        this.#colorSelector = selector;
        return this;
    }

    public build_createPoints(): void {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        const center_B: P5Lib.Vector = this.#EDGE_B.center;
        const length: number = P5Lib.Vector.dist(center_A, center_B);
        this.#createPoints(this.#EDGE_A.length / 2.0, this.#EDGE_B.length / 2.0, length);
    }

    #createPoints(amplitude_A: number, amplitude_B: number, length: number): void {
        let theta: number = this.#initialTheta;
        const spacing: number = (length / this.#pointCount);
        const offset: number = spacing / 2.0;

        for (let i: number = 0; i < this.#pointCount; i++) {
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = offset + (i * spacing);
            pointBase.y = 0;
            const percent: number = pointBase.x / length;
            const amp: number = P5Context.p5.map(percent, 0, 1, amplitude_A, amplitude_B);

            let color: Color = new Color(255, 0, 0);

            if (this.#colorSelector) {
                color = this.#colorSelector.getColor();
            }

            const point: Point = new Point(pointBase, amp, theta, this.#deltaTheta, color);
            this.#POINTS.push(point);
            theta += (((Math.PI * 2) * this.#frequency) / (this.#pointCount - 1));
        }
    }

    updatePoints(): void {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        const center_B: P5Lib.Vector = this.#EDGE_B.center;
        const length: number = P5Lib.Vector.dist(center_A, center_B);

        this.#updatePoints(this.#EDGE_A.length / 2.0, this.#EDGE_B.length / 2.0, length);
    }

    #updatePoints(amplitude_A: number, amplitude_B: number, length: number): void {
        const spacing: number = (length / this.#pointCount);
        const offset: number = spacing / 2.0;

        for (let i: number = 0; i < this.#pointCount; i++) {
            const point: Point = this.#POINTS[i];
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = offset + (i * spacing);
            pointBase.y = 0;
            point.base.position = pointBase;
            const percent: number = pointBase.x / length;
            point.amplitude = P5Context.p5.map(percent, 0, 1, amplitude_A, amplitude_B);
            point.updatePosition();
        }
    }

    #updateRotation(): void {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const p5: P5Lib = P5Context.p5;
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        const translated_B: P5Lib.Vector = P5Lib.Vector.sub(this.#EDGE_B.center, center_A);

        p5.push();
        p5.translate(center_A.x, center_A.y);
        this.#rotation = translated_B.heading();
        p5.pop();
    }

    debug_drawFrame(border: number): void {
        const p5: P5Lib = P5Context.p5;
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        p5.stroke(border);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.noFill();
        p5.quad(this.#EDGE_A.top.x, this.#EDGE_A.top.y,
            this.#EDGE_B.top.x, this.#EDGE_B.top.y,
            this.#EDGE_B.bottom.x, this.#EDGE_B.bottom.y,
            this.#EDGE_A.bottom.x, this.#EDGE_A.bottom.y);

        p5.strokeWeight(CanvasContext.defaultStroke * 5);
        p5.stroke(0, 255, 0);
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        p5.point(center_A.x, center_A.y);

        p5.stroke(0, 0, 255);
        const center_B: P5Lib.Vector = this.#EDGE_B.center;
        p5.point(center_B.x, center_B.y);

        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.stroke(0, 255, 255);
        const dist: number = center_A.dist(center_B);
        p5.push();
        p5.translate(center_A.x, center_A.y);
        p5.rotate(this.#rotation);
        p5.line(0, 0, dist, 0);
        p5.pop();
    }
}
