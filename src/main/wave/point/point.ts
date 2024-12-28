/*
 * Copyright (C) 2015-2024 brittni and the polar bear LLC.
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

import { CanvasContext, P5Context } from '@batpb/genart';

export interface PointConfig {
    waveRatio_start: number;
    waveRatio_end: number;
    base: P5Lib.Vector;
    diameter: number;
}

/**
 * NOTES:
 * - The Point class assumes that it's base is on a line starting at (0, 0), and ending at (waveLength, 0).
 */
export class Point {
    #waveRatio_start: number;
    #waveRatio_end: number;
    #base: P5Lib.Vector;
    #diameter: number;
    // #theta: number = 0;
    // #deltaTheta: number = 0.01;

    public constructor(config: PointConfig) {
        this.#base = config.base;
        this.#diameter = config.diameter;
        this.#waveRatio_start = config.waveRatio_start;
        this.#waveRatio_end = config.waveRatio_end;
    }

    public get waveRatio_start(): number {
        return this.#waveRatio_start;
    }

    public get waveRatio_end(): number {
        return this.#waveRatio_end;
    }

    public get waveRatio_center(): number {
        return (this.waveRatio_start + this.waveRatio_end) / 2;
    }

    public get waveRatio_length(): number {
        return Math.abs(this.waveRatio_end - this.waveRatio_start);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.fill(255, 0, 0);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.stroke(0, 0, 255);
        p5.ellipse(this.#base.x, this.#base.y, this.#diameter, this.#diameter);
    }

    public updateBase(base: P5Lib.Vector): void {
        this.#base.set(base);
    }

    public updateDiameter(diameter: number): void {
        this.#diameter = diameter;
    }
}
