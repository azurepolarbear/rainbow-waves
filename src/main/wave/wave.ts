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

import {
    CanvasContext,
    CanvasRedrawListener,
    Color,
    ColorSelector,
    CoordinateMode,
    P5Context
} from '@batpb/genart';

import { Point, PointConfig } from './point';
import { WaveEdge } from './wave-edge';
import {PointSize} from "./wave-categories";
import {CategorySelector} from "../category-selector";

// TODO - random amplitude for each point
// TODO - perlin amplitude for each point
// TODO - random theta for each point

interface PointData {
    amplitude_A: number;
    amplitude_B: number;
    length: number;
    spacing: number;
    offset: number;
}

export interface WaveConfig {
    coordinateMode: CoordinateMode;
    edgeA: { top: P5Lib.Vector; bottom: P5Lib.Vector; };
    edgeB: { top: P5Lib.Vector; bottom: P5Lib.Vector; };
    pointTotal: number;
    frequency: number;
    deltaTheta: number;
    initialTheta: number;
    colorSelector: ColorSelector;
    pointSizeSelector: CategorySelector<PointSize>;
    pointOverlap: boolean;
}

export class Wave implements CanvasRedrawListener {
    readonly #EDGE_A: WaveEdge;
    readonly #EDGE_B: WaveEdge;
    readonly #POINTS: Point[] = [];

    #frequency: number = 1;
    #pointTotal: number = 25;
    #initialTheta: number = 0;
    #deltaTheta: number = 0.005;
    #rotation: number = 0;
    #colorSelector: ColorSelector;
    #maxPointDiameter: number = 0;
    #pointSizeSelector: CategorySelector<PointSize>;
    #pointOverlap: boolean = false;
    // #fillSpace: boolean = true;

    public constructor(config: WaveConfig) {
        this.#EDGE_A = new WaveEdge(config.edgeA.top, config.edgeA.bottom, config.coordinateMode);
        this.#EDGE_B = new WaveEdge(config.edgeB.top, config.edgeB.bottom, config.coordinateMode);

        this.#updateRotation();

        this.#pointTotal = Math.floor(P5Context.p5.constrain(config.pointTotal, Wave.MIN_POINTS, Wave.MAX_POINTS));
        this.#deltaTheta = P5Context.p5.constrain(config.deltaTheta, Wave.MIN_SPEED, Wave.MAX_SPEED);
        this.#initialTheta = config.initialTheta % (Math.PI * 2);
        this.#frequency = config.frequency;
        this.#colorSelector = config.colorSelector;
        this.#pointSizeSelector = config.pointSizeSelector;
        this.#pointOverlap = config.pointOverlap;

        this.#buildPoints();
    }

    public static get MIN_POINTS(): number {
        return 5;
    }

    public static get MAX_POINTS(): number {
        return 1_000;
    }

    public static get MIN_SPEED(): number {
        return 0.0001;
    }

    public static get MAX_SPEED(): number {
        return 0.1;
    }

    public get buffer(): number {
        return this.#maxPointDiameter * 0.6;
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.push();
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        p5.translate(center_A);
        p5.rotate(this.#rotation);
        this.#POINTS.forEach((point: Point): void => {
            point.draw();
        });
        p5.pop();
    }

    public updateEdgeA(top: P5Lib.Vector, bottom: P5Lib.Vector, mode: CoordinateMode): void {
        this.#EDGE_A.update(top, bottom, mode);
        this.#updateRotation();
        this.#updatePoints();
        this.#POINTS.forEach((point: Point): void => {
            point.canvasRedraw();
        });
    }

    public updateEdgeB(top: P5Lib.Vector, bottom: P5Lib.Vector, mode: CoordinateMode): void {
        this.#EDGE_B.update(top, bottom, mode);
        this.#updateRotation();
        this.#updatePoints();
        this.#POINTS.forEach((point: Point): void => {
            point.canvasRedraw();
        });
    }

    public canvasRedraw(): void {
        this.#EDGE_A.remap();
        this.#EDGE_B.remap();
        this.#updateRotation();
        this.#updatePoints();

        this.#POINTS.forEach((point: Point): void => {
            point.canvasRedraw();
        });
    }

    #buildPoints(): void {
        const data: PointData = this.#getPointData();
        // TODO - calculate the size of each point first
        // TODO -  - get stroke multiplier, calculate diameter, calculate diameter's percentage of length
        // TODO -  - generate multipliers until the total length is filled
        // TODO - generate points using the multipliers
        // TODO -  - calculate x position based on previous point's diameter and current diameter

        const minX: number = this.#EDGE_A.center.x;
        const maxX: number = this.#EDGE_B.center.x;
        const maxStrokeMultiplier: number = (Math.min(data.amplitude_A, data.amplitude_B) / 2.0) / CanvasContext.defaultStroke;

        let currentX: number = minX + data.offset;
        let previousEdge: number = minX;
        let building: boolean = true;

        while (building) {
            let strokeMultiplier: number = this.#pointSizeSelector.getChoice();
            strokeMultiplier = P5Context.p5.constrain(strokeMultiplier, 0, maxStrokeMultiplier);
            let pointRadius: number = (CanvasContext.defaultStroke * strokeMultiplier) / 2.0;

            if (((currentX - pointRadius) < previousEdge) && !this.#pointOverlap) {
                currentX = previousEdge + pointRadius;
            }

            if ((currentX + pointRadius) > maxX) {
                // const r: number = maxX - currentX;
                // strokeMultiplier = (r * 2.0) / CanvasContext.defaultStroke;
                // building = false;
                break;
            }

            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = currentX;
            pointBase.y = 0;

            const amp: number = P5Context.p5.map(pointBase.x, minX, maxX, data.amplitude_A, data.amplitude_B);
            const theta: number = P5Context.p5.map(pointBase.x, minX, maxX, this.#initialTheta, this.#initialTheta + (Math.PI * 2 * this.#frequency));

            const color: Color = this.#colorSelector.getColor();

            const config: PointConfig = {
                base: pointBase,
                coordinateMode: CoordinateMode.CANVAS,
                amplitude: amp,
                theta: theta,
                deltaTheta: this.#deltaTheta,
                color: color,
                strokeMultiplier: strokeMultiplier
            };

            const point: Point = new Point(config);
            this.#POINTS.push(point);

            if (this.#maxPointDiameter < point.diameter) {
                this.#maxPointDiameter = point.diameter;
            }

            previousEdge = currentX + (point.diameter / 2.0);
            currentX = Math.max(previousEdge + data.spacing, currentX + data.spacing);

            if (this.#POINTS.length >= this.#pointTotal) {
                building = false;
            }
        }
    }

    #updatePoints(): void {
        this.#maxPointDiameter = 0;
        for (const point of this.#POINTS) {
            if (this.#maxPointDiameter < point.diameter) {
                this.#maxPointDiameter = point.diameter;
            }
        }

        const data: PointData = this.#getPointData();
        const minX: number = this.#EDGE_A.center.x;
        const maxX: number = this.#EDGE_B.center.x;
        let initialTheta: number = this.#POINTS[0].theta;

        for (const point of this.#POINTS) {
            const pointX: number = point.base.getX(CoordinateMode.CANVAS);
            point.amplitude = P5Context.p5.map(pointX, minX, maxX, data.amplitude_A, data.amplitude_B);
            point.theta = P5Context.p5.map(pointX, minX, maxX, initialTheta, initialTheta + (Math.PI * 2 * this.#frequency));
            point.canvasRedraw();
            point.updatePosition();
        }
    }

    #updateRotation(): void {
        const p5: P5Lib = P5Context.p5;
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        const translated_B: P5Lib.Vector = P5Lib.Vector.sub(this.#EDGE_B.center, center_A);

        p5.push();
        p5.translate(center_A.x, center_A.y);
        this.#rotation = translated_B.heading();
        p5.pop();
    }

    #getPointData(): PointData {
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        const center_B: P5Lib.Vector = this.#EDGE_B.center;
        const length: number = P5Lib.Vector.dist(center_A, center_B);
        const spacing: number = (length / this.#pointTotal);

        return {
            amplitude_A: (this.#EDGE_A.length / 2.0) - this.buffer,
            amplitude_B: (this.#EDGE_B.length / 2.0) - this.buffer,
            length: length,
            spacing: spacing,
            offset: spacing / 2.0
        };
    }

    debug_drawFrame(border: number): void {
        const p5: P5Lib = P5Context.p5;
        p5.stroke(border);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.noFill();
        p5.quad(
            this.#EDGE_A.top.x,
            this.#EDGE_A.top.y,
            this.#EDGE_B.top.x,
            this.#EDGE_B.top.y,
            this.#EDGE_B.bottom.x,
            this.#EDGE_B.bottom.y,
            this.#EDGE_A.bottom.x,
            this.#EDGE_A.bottom.y
        );

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
