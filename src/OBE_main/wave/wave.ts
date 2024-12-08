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

import P5Lib from 'p5';

import {
    CanvasContext,
    CanvasRedrawListener,
    Color,
    ColorSelector,
    Coordinate,
    CoordinateMode,
    P5Context
} from '@batpb/genart';

import { PointSet, PointSetConfig } from './point';

interface PointData {
    amplitude_A: number;
    amplitude_B: number;
    length: number;
    spacing: number;
    offset: number;
}

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
    edgeA: { top: P5Lib.Vector; bottom: P5Lib.Vector; };
    edgeB: { top: P5Lib.Vector; bottom: P5Lib.Vector; };
    pointTotal: number;
    frequency: number;
    deltaTheta: number;
    initialTheta: number;
    colorSelector: ColorSelector;
}

export class Wave implements CanvasRedrawListener {
    readonly #EDGE_A: Edge = new Edge();
    readonly #EDGE_B: Edge = new Edge();
    // readonly #POINTS: Point[] = [];
    readonly #POINT_SETS: PointSet[] = [];

    #frequency: number = 1;
    #pointTotal: number = 25;
    #initialTheta: number = 0;
    #deltaTheta: number = 0.005;
    #rotation: number = 0;
    #colorSelector: ColorSelector;

    public constructor(config: WaveConfig) {
        this.#EDGE_A.top.setPosition(config.edgeA.top, config.coordinateMode);
        this.#EDGE_A.bottom.setPosition(config.edgeA.bottom, config.coordinateMode);
        this.#EDGE_B.top.setPosition(config.edgeB.top, config.coordinateMode);
        this.#EDGE_B.bottom.setPosition(config.edgeB.bottom, config.coordinateMode);
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
        // this.#POINTS.forEach((point: Point): void => {
        //     point.draw();
        // });
        this.#POINT_SETS.forEach((pointSet: PointSet): void => {
            pointSet.draw();
        });
        p5.pop();
    }

    public canvasRedraw(): void {
        this.#EDGE_A.remap();
        this.#EDGE_B.remap();
        this.#updateRotation();
        this.#updatePoints();
        this.#POINT_SETS.forEach((pointSet: PointSet): void => {
            pointSet.canvasRedraw();
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

            const config: PointSetConfig = {
                base: pointBase,
                coordinateMode: CoordinateMode.CANVAS,
                amplitude: amp,
                theta: theta,
                deltaTheta: this.#deltaTheta,
                color: color,
                totalPoints: 50,
                evenDistribution: true
            };

            const pointSet: PointSet = new PointSet(config);
            this.#POINT_SETS.push(pointSet);
            theta += (((Math.PI * 2) * this.#frequency) / (this.#pointTotal - 1));
        }
    }

    #updatePoints(): void {
        const data: PointData = this.#getPointData();

        for (let i: number = 0; i < this.#pointTotal; i++) {
            const pointSet: PointSet = this.#POINT_SETS[i];
            const pointBase: P5Lib.Vector = new P5Lib.Vector();
            pointBase.x = data.offset + (i * data.spacing);
            pointBase.y = 0;
            // pointSet.updateBase();
            // pointSet.updateAmplitude();
            pointSet.setBase(pointBase, CoordinateMode.CANVAS);
            const percent: number = pointBase.x / data.length;
            pointSet.setAmplitude(P5Context.p5.map(percent, 0, 1, data.amplitude_A, data.amplitude_B));
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
            this.#EDGE_A.topVector.x,
            this.#EDGE_A.topVector.y,
            this.#EDGE_B.topVector.x,
            this.#EDGE_B.topVector.y,
            this.#EDGE_B.bottomVector.x,
            this.#EDGE_B.bottomVector.y,
            this.#EDGE_A.bottomVector.x,
            this.#EDGE_A.bottomVector.y
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
