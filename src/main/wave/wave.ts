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

class Edge {
    public readonly top: Coordinate = new Coordinate();
    public readonly bottom: Coordinate = new Coordinate();

    public center(): P5Lib.Vector {
        return P5Lib.Vector.lerp(this.top.position, this.bottom.position, 0.5);
    }

    public remap(): void {
        this.top.remap();
        this.bottom.remap();
    }
}

export class Wave implements CanvasRedrawListener {
    readonly #edge_A: Edge = new Edge();
    readonly #edge_B: Edge = new Edge();

    // public static readonly MIN_SPEED: number = 0.0001;
    // public static readonly MAX_SPEED: number = 1;
    // #length: number;
    // #amplitude: number;
    // #frequency: number;
    // #pointCount: number;
    //
    // #deltaTheta: number;
    // readonly #points: Point[] = [];
    //
    // static readonly #MIN_POINTS: number = 5;
    // static readonly #MAX_POINTS: number = 1_000;

    // readonly #leftEdge: Edge = new Edge();
    // readonly #rightEdge: Edge = new Edge();
    // readonly #deltaTheta: number = 0.05;
    // readonly #points: Point[] = [];
    // readonly #frequency: number = 1;
    //
    // #pointCount: number = 50;

    #rotation: number = 0;

    public set_edge_A(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        this.#edge_A.top.position = top;
        this.#edge_A.bottom.position = bottom;
        this.#updateRotation();
        return this;
    }

    public set_edge_B(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        this.#edge_B.top.position = top;
        this.#edge_B.bottom.position = bottom;
        this.#updateRotation();
        return this;
    }

    // public setPointCount(pointCount: number): Wave {
    //     this.#pointCount = Math.floor(P5Context.p5.constrain(pointCount, Wave.MIN_POINTS, Wave.MAX_POINTS));
    //     return this;
    // }

    #updateRotation(): void {
        const p5: P5Lib = P5Context.p5;
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const center_A: P5Lib.Vector = this.#edge_A.center();
        const translated_B: P5Lib.Vector = P5Lib.Vector.sub(this.#edge_B.center(), center_A);
        p5.push();
        p5.translate(center_A.x, center_A.y);
        this.#rotation = translated_B.heading();
        p5.pop();
    }

    draw(): void {
        this.#debug_drawFrame();
    }

    public canvasRedraw(): void {
        this.#edge_A.remap();
        this.#edge_B.remap();
        this.#updateRotation();
    }

    #debug_drawFrame(): void {
        const p5: P5Lib = P5Context.p5;
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        p5.stroke(0);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.noFill();
        p5.quad(this.#edge_A.top.x, this.#edge_A.top.y,
            this.#edge_B.top.x, this.#edge_B.top.y,
            this.#edge_B.bottom.x, this.#edge_B.bottom.y,
            this.#edge_A.bottom.x, this.#edge_A.bottom.y);

        p5.strokeWeight(CanvasContext.defaultStroke * 5);
        p5.stroke(0, 255, 0);
        const center_A: P5Lib.Vector = this.#edge_A.center();
        p5.point(center_A.x, center_A.y);

        p5.stroke(0, 0, 255);
        const center_B: P5Lib.Vector = this.#edge_B.center();
        p5.point(center_B.x, center_B.y);

        p5.strokeWeight(CanvasContext.defaultStroke * 2);
        p5.stroke(0, 255, 255);
        // const translated_B: P5Lib.Vector = P5Lib.Vector.sub(center_B, center_A);
        const dist: number = center_A.dist(center_B);
        p5.push();
        p5.translate(center_A.x, center_A.y);
        p5.rotate(this.#rotation);
        p5.line(0, 0, dist, 0);
        p5.pop();
    }

    // #buildPoints(): void {
    //     Coordinate.coordinateMode = CoordinateMode.CANVAS;
    //     const leftCenter: Coordinate = Edge.center(this.#leftEdge);
    //     const rightCenter: Coordinate = Edge.center(this.#rightEdge);
    //     const length: number = Math.abs(rightCenter.x - leftCenter.x);
    //
    //     let theta: number = 0;
    //     let xSpace: number = (length / this.#pointCount);
    //     let xOffset: number = xSpace / 2.0;
    //
    //     for (let i: number = 0; i < this.#pointCount; i++) {
    //         const pointBase: P5Lib.Vector = new P5Lib.Vector();
    //         pointBase.x = leftCenter.x + xOffset + (i * xSpace);
    //         pointBase.y = this.#calculateBaseY(pointBase.x);
    //         const amp: number = this.#calculateAmplitude(pointBase.x);
    //         const point: Point = new Point(pointBase, amp, theta, this.#deltaTheta);
    //         this.#points.push(point);
    //         theta += ((P5Context.p5.TWO_PI * this.#frequency) / (this.#pointCount - 1));
    //     }
    // }

    // #topPercent(x: number) {
    //     const p5: P5Lib = P5Context.p5;
    //     return p5.map(x, this.#leftEdge.top.x, this.#rightEdge.top.x, 0, 1);
    // }
    //
    // #bottomPercent(x: number) {
    //     const p5: P5Lib = P5Context.p5;
    //     return p5.map(x, this.#leftEdge.bottom.x, this.#rightEdge.bottom.x, 0, 1);
    // }
    //
    // #calculateAmplitude(x: number) {
    //     const topPercent: number = this.#topPercent(x);
    //     const bottomPercent: number = this.#bottomPercent(x);
    //     const top: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.top.position, this.#rightEdge.top.position, topPercent);
    //     const bottom: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.bottom.position, this.#rightEdge.bottom.position, bottomPercent);
    //     const height: number = P5Lib.Vector.dist(top, bottom);
    //     return height / 2.0;
    // }
    //
    // #calculateBaseY(x: number) {
    //     Coordinate.coordinateMode = CoordinateMode.CANVAS;
    //     const p5: P5Lib = P5Context.p5;
    //     const topPercent: number = p5.map(x, this.#leftEdge.top.x, this.#rightEdge.top.x, 0, 1);
    //     const bottomPercent: number = p5.map(x, this.#leftEdge.bottom.x, this.#rightEdge.bottom.x, 0, 1);
    //     const top: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.top.position, this.#rightEdge.top.position, topPercent);
    //     const bottom: P5Lib.Vector = P5Lib.Vector.lerp(this.#leftEdge.bottom.position, this.#rightEdge.bottom.position, bottomPercent);
    //     return p5.lerp(top.y, bottom.y, 0.5);
    // }
}
