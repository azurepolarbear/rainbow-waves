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
    theta: number;
    deltaTheta: number;
    amplitude: number;
}

/**
 * NOTES:
 * - The Point class assumes that it's base is on a line starting at (0, 0), and ending at (waveLength, 0).
 */
export class Point {
    #waveRatio_start: number;
    #waveRatio_end: number;
    #base: P5Lib.Vector;
    #position: P5Lib.Vector;
    #diameter: number;
    #theta: number;
    #deltaTheta: number;
    #amplitude: number;

    public constructor(config: PointConfig) {
        this.#base = config.base;
        this.#position = this.#base.copy();
        this.#diameter = config.diameter;
        this.#waveRatio_start = config.waveRatio_start;
        this.#waveRatio_end = config.waveRatio_end;
        this.#theta = config.theta;
        this.#deltaTheta = config.deltaTheta;
        this.#amplitude = config.amplitude;
    }

    public getWaveRatioStart(): number {
        return this.#waveRatio_start;
    }

    public getWaveRatioEnd(): number {
        return this.#waveRatio_end;
    }

    public getWaveRatioCenter(): number {
        return (this.#waveRatio_start + this.#waveRatio_end) / 2;
    }

    public getWaveRatioLength(): number {
        return Math.abs(this.#waveRatio_end - this.#waveRatio_start);
    }

    public updateAmplitude(amplitude: number): void {
        this.#amplitude = amplitude;
    }

    public updateBase(base: P5Lib.Vector): void {
        this.#base.set(base);
    }

    public updateDiameter(diameter: number): void {
        this.#diameter = diameter;
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.fill(255, 0, 0);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.stroke(0, 0, 255);
        p5.ellipse(this.#position.x, this.#position.y, this.#diameter, this.#diameter);
    }

    public move(): void {
        this.#theta += this.#deltaTheta;
        this.#updatePosition();
    }

    #updatePosition(): void {
        this.#position.set(this.#base.x, this.#calculateY());
    }

    #calculateY(): number {
        return (this.#base.y + (this.#amplitude * Math.sin(this.#theta)));
    }
}
