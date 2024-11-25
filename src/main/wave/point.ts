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

import { CanvasRedrawListener, Color, Coordinate, CoordinateMode, Point as PointShape } from '@batpb/genart';

export interface PointConfig {
    readonly base: P5Lib.Vector | { x: number; y: number; };
    readonly coordinateMode: CoordinateMode;
    readonly amplitude: number;
    readonly theta: number;
    readonly deltaTheta: number;
    readonly color: Color;
}

export class Point implements CanvasRedrawListener {
    readonly #point: PointShape;
    readonly #base: Coordinate = new Coordinate();
    readonly #deltaTheta: number;

    #theta: number;
    #amplitude: number;

    public constructor(config: PointConfig) {
        if (config.base instanceof P5Lib.Vector) {
            this.#base.setPosition(config.base, config.coordinateMode);
        } else {
            this.#base.setX(config.base.x, config.coordinateMode);
            this.#base.setY(config.base.y, config.coordinateMode);
        }

        this.#amplitude = config.amplitude;
        this.#theta = config.theta;
        this.#deltaTheta = config.deltaTheta;
        this.#point = new PointShape({ coordinateMode: CoordinateMode.CANVAS });
        this.#point.style.stroke = config.color;
        this.#point.style.strokeMultiplier = 4;
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

    public set amplitude(amplitude: number) {
        this.#amplitude = amplitude;
    }

    public get base(): Coordinate {
        return this.#base;
    }

    public updatePosition(): void {
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        this.#point.setX(this.#base.getX(mode), mode);
        this.#point.setY(this.#calculateY(), mode);
    }

    #update(): void {
        this.#theta = (this.#theta + this.#deltaTheta) % (Math.PI * 2);
        this.updatePosition();
    }

    #calculateY(): number {
        return (this.#base.getY(CoordinateMode.CANVAS) + (Math.sin(this.#theta) * this.#amplitude));
    }
}
