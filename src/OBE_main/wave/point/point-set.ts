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

import { Point, PointConfig } from './point';
import { CanvasRedrawListener, Color, CoordinateMode } from '@batpb/genart';
import P5Lib from 'p5';

export interface PointSetConfig {
    readonly base: P5Lib.Vector | { x: number; y: number; };
    readonly coordinateMode: CoordinateMode;
    readonly amplitude: number;
    readonly theta: number;
    readonly deltaTheta: number;
    readonly color: Color;
    readonly totalPoints: number;
    readonly evenDistribution: boolean;
}

export class PointSet implements CanvasRedrawListener {
    readonly #POINTS: Point[] = [];

    // #primaryTheta: number;
    #angleLength: number;

    #totalPoints: number;

    // #evenDistribution: boolean;

    // #base: Coordinate;
    // #deltaTheta: number;
    // #theta: number;
    // #amplitude: number;

    public constructor(config: PointSetConfig) {
        this.#totalPoints = config.totalPoints;
        this.#angleLength = Math.PI;
        // this.#primaryTheta = config.theta;
        // this.#evenDistribution = true;

        let t: number = config.theta;
        const minAlpha: number = 50;
        let a: number = 255;

        for (let i: number = 0; i < this.#totalPoints; i++) {
            const c: Color = new Color(config.color);
            c.alpha = a;

            const pConfig: PointConfig = {
                base: config.base,
                coordinateMode: config.coordinateMode,
                amplitude: config.amplitude,
                theta: t,
                deltaTheta: config.deltaTheta,
                color: c
            };

            this.#POINTS.push(new Point(pConfig));

            // TODO - even distribution?
            t += this.#angleLength / this.#totalPoints;
            a -= 255 / this.#totalPoints;

            if (a < minAlpha) {
                break;
            }
        }
    }

    public static get MIN_POINTS(): number {
        return 1;
    }

    public setAmplitude(amplitude: number): void {
        this.#POINTS.forEach((point: Point): void => {
            point.setAmplitude(amplitude);
        });
    }

    public setBase(position: P5Lib.Vector, mode: CoordinateMode): void {
        this.#POINTS.forEach((point: Point): void => {
            point.setBase(position, mode);
        });
    }

    public canvasRedraw(): void {
        this.#POINTS.forEach((point: Point): void => {
            point.canvasRedraw();
        });
    }

    public draw(): void {
        this.#POINTS.forEach((point: Point): void => {
            point.draw();
        });
    }
}
