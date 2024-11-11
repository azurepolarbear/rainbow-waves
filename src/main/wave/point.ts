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

import {CanvasRedrawListener, Color, Coordinate, CoordinateMode, Point as PointShape} from '@batpb/genart'
import P5Lib from "p5";

export class Point implements CanvasRedrawListener {
    readonly #point: PointShape = new PointShape();
    readonly #base: Coordinate = new Coordinate();
    readonly #deltaTheta: number;

    #theta: number;
    #amplitude: number;

    public constructor(base: P5Lib.Vector, amplitude: number, theta: number, deltaTheta: number) {
        this.#base.position = base;
        this.#amplitude = amplitude;
        this.#theta = theta;
        this.#deltaTheta = deltaTheta;

        this.#point.stroke = new Color(255, 0, 0);
        this.#point.strokeMultiplier = 4;
        this.updatePosition();
    }

    public draw(): void {
        this.#point.draw();
        this.#update();
    }

    public canvasRedraw(): void {
        this.#base.remap();
        this.#point.canvasRedraw();
    }

    public get amplitude(): undefined {
        return undefined;
    }

    public set amplitude(amplitude: number) {
        this.#amplitude = amplitude;
    }

    public get base(): Coordinate {
        return this.#base;
    }

    public updatePosition(): void {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        this.#point.x = this.#base.x;
        this.#point.y = this.#calculateY();
    }

    #update(): void {
        this.#theta += this.#deltaTheta;
        this.updatePosition();
    }

    #calculateY(): number {
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        return (this.#base.y + (Math.sin(this.#theta) * this.#amplitude));
    }
}
