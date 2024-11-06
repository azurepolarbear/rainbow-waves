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

import {CanvasContext, CanvasRedrawListener, Coordinate, CoordinateMode, P5Context} from "@batpb/genart";
import P5Lib from "p5";
import {Point} from "./point";

class Edge {
    public readonly top: Coordinate = new Coordinate();
    public readonly bottom: Coordinate = new Coordinate();

    public static center(edge: Edge): Coordinate {
        const center: Coordinate = new Coordinate();
        center.position = P5Lib.Vector.lerp(edge.top.position, edge.bottom.position, 0.5);
        return center;
    }
}

export class Wave implements CanvasRedrawListener {
    // readonly #base_topLeft: Coordinate = new Coordinate();
    // readonly #base_bottomRight: Coordinate = new Coordinate();

    public static readonly MIN_POINTS: number = 5;
    public static readonly MAX_POINTS: number = 1_000;

    readonly #leftEdge: Edge = new Edge();
    readonly #rightEdge: Edge = new Edge();
    readonly #deltaTheta: number = 0.05;
    readonly #points: Point[] = [];
    readonly #frequency: number = 1;

    #pointCount: number = 50;

    // constructor -> base(x, y), length, rotation, pointCount, amplitude, frequency, speed
    // constructor -> topLeft(x, y), bottomRight(x, y), pointCount, amplitude, frequency, speed

    // constructor(topLeft: P5Lib.Vector, bottomRight: P5Lib.Vector) {
    // }

    public setLeftEdge(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        this.#leftEdge.top.position = top;
        this.#leftEdge.bottom.position = bottom;
        return this;
    }

    public setRightEdge(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        this.#rightEdge.top.position = top;
        this.#rightEdge.bottom.position = bottom;
        return this;
    }

    public setPointCount(pointCount: number): Wave {
        this.#pointCount = Math.floor(P5Context.p5.constrain(pointCount, Wave.MIN_POINTS, Wave.MAX_POINTS));
        return this;
    }

    public buildPoints(): void {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const leftCenter: Coordinate = Edge.center(this.#leftEdge);
        const rightCenter: Coordinate = Edge.center(this.#rightEdge);
        const length: number = Math.abs(rightCenter.x - leftCenter.x);

        let theta: number = 0;
        let xSpace: number = (length / this.#pointCount);
        let xOffset: number = xSpace / 2.0;

        for (let i: number = 0; i < this.#pointCount; i++) {
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = leftCenter.x + xOffset + (i * xSpace);
            pointBase.y = this.#calculateBaseY(pointBase.x);
            const amp: number = this.#calculateAmplitude(pointBase.x);
            const point: Point = new Point(pointBase, amp, theta, this.#deltaTheta);
            this.#points.push(point);
            theta += ((P5Context.p5.TWO_PI * this.#frequency) / (this.#pointCount - 1));
        }
    }

    #topPercent(x: number) {
        const p5: P5Lib = P5Context.p5;
        return p5.map(x, this.#leftEdge.top.x, this.#rightEdge.top.x, 0, 1);
    }

    #bottomPercent(x: number) {
        const p5: P5Lib = P5Context.p5;
        return p5.map(x, this.#leftEdge.bottom.x, this.#rightEdge.bottom.x, 0, 1);
    }

    #calculateAmplitude(x: number) {
        const topPercent: number = this.#topPercent(x);
        const bottomPercent: number = this.#bottomPercent(x);
        const top: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.top.position, this.#rightEdge.top.position, topPercent);
        const bottom: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.bottom.position, this.#rightEdge.bottom.position, bottomPercent);
        const height: number = P5Lib.Vector.dist(top, bottom);
        return height / 2.0;
    }

    #calculateBaseY(x: number) {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const p5: P5Lib = P5Context.p5;
        const topPercent: number = p5.map(x, this.#leftEdge.top.x, this.#rightEdge.top.x, 0, 1);
        const bottomPercent: number = p5.map(x, this.#leftEdge.bottom.x, this.#rightEdge.bottom.x, 0, 1);
        const top: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.top.position, this.#rightEdge.top.position, topPercent);
        const bottom: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.bottom.position, this.#rightEdge.bottom.position, bottomPercent);
        return p5.lerp(top.y, bottom.y, 0.5);
    }

    canvasRedraw(): void {
        this.#leftEdge.top.remap();
        this.#leftEdge.bottom.remap();
        this.#rightEdge.top.remap();
        this.#rightEdge.bottom.remap();
        this.#points.forEach((pt: Point): void => pt.canvasRedraw());
        // TODO - remap amplitude and set properly on each point
    }

    draw(): void {
        this.#debug_drawFrame();
        this.#points.forEach((pt: Point): void => pt.draw());
    }

    #debug_drawFrame(): void {
        const p5: P5Lib = P5Context.p5;
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        p5.stroke(0);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.quad(this.#leftEdge.top.x, this.#leftEdge.top.y,
                this.#rightEdge.top.x, this.#rightEdge.top.y,
                this.#rightEdge.bottom.x, this.#rightEdge.bottom.y,
                this.#leftEdge.bottom.x, this.#leftEdge.bottom.y);

        p5.strokeWeight(CanvasContext.defaultStroke * 5);
        p5.stroke(0, 255, 0);
        const leftCenter: Coordinate = Edge.center(this.#leftEdge);
        p5.point(leftCenter.x, leftCenter.y);

        p5.stroke(0, 0, 255);
        const rightCenter: Coordinate = Edge.center(this.#rightEdge);
        p5.point(rightCenter.x, rightCenter.y);
    }
}
