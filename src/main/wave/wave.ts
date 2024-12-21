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
    ColorSelector, Coordinate,
    CoordinateMode,
    P5Context
} from '@batpb/genart';

import { Point, PointConfig } from './point';
import { WaveEdge } from './wave-edge';

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

    public constructor(config: WaveConfig) {
        const edgeA_top: Coordinate = new Coordinate();
        edgeA_top.setPosition(config.edgeA.top, config.coordinateMode);
        const edgeA_bottom: Coordinate = new Coordinate();
        edgeA_bottom.setPosition(config.edgeA.bottom, config.coordinateMode);
        this.#EDGE_A = new WaveEdge(edgeA_top, edgeA_bottom);

        const edgeB_top: Coordinate = new Coordinate();
        edgeB_top.setPosition(config.edgeB.top, config.coordinateMode);
        const edgeB_bottom: Coordinate = new Coordinate();
        edgeB_bottom.setPosition(config.edgeB.bottom, config.coordinateMode);
        this.#EDGE_B = new WaveEdge(edgeB_top, edgeB_bottom);

        this.#updateRotation();

        this.#pointTotal = Math.floor(P5Context.p5.constrain(config.pointTotal, Wave.MIN_POINTS, Wave.MAX_POINTS));
        this.#deltaTheta = P5Context.p5.constrain(config.deltaTheta, Wave.MIN_SPEED, Wave.MAX_SPEED);
        this.#initialTheta = config.initialTheta % (Math.PI * 2);
        this.#frequency = config.frequency;
        this.#colorSelector = config.colorSelector;
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
        let theta: number = this.#initialTheta;

        for (let i: number = 0; i < this.#pointTotal; i++) {
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = data.offset + (i * data.spacing);
            pointBase.y = 0;
            const percent: number = pointBase.x / data.length;
            const amp: number = P5Context.p5.map(percent, 0, 1, data.amplitude_A, data.amplitude_B);
            const color: Color = this.#colorSelector.getColor();

            const config: PointConfig = {
                base: pointBase,
                coordinateMode: CoordinateMode.CANVAS,
                amplitude: amp,
                theta: theta,
                deltaTheta: this.#deltaTheta,
                color: color
            };

            const point: Point = new Point(config);
            this.#POINTS.push(point);
            theta += (((Math.PI * 2) * this.#frequency) / (this.#pointTotal - 1));
        }
    }

    #updatePoints(): void {
        const data: PointData = this.#getPointData();

        for (let i: number = 0; i < this.#pointTotal; i++) {
            const point: Point = this.#POINTS[i];
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = data.offset + (i * data.spacing);
            pointBase.y = 0;
            point.setBase(pointBase, CoordinateMode.CANVAS);
            const percent: number = pointBase.x / data.length;
            point.amplitude = P5Context.p5.map(percent, 0, 1, data.amplitude_A, data.amplitude_B);
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
            amplitude_A: this.#EDGE_A.length / 2.0,
            amplitude_B: this.#EDGE_B.length / 2.0,
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
