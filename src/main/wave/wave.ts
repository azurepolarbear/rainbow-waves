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

import {CanvasContext, CanvasRedrawListener, CoordinateMode, P5Context} from '@batpb/genart';

import {Point, PointConfig} from './point';

import {WaveEdge} from './wave-edge';
import {AmplitudeType, PointSize, WaveFill} from "./wave-categories";
import {CategorySelector} from "../category-selector";

interface WaveData {
    amplitude_A: number;
    amplitude_B: number;
    length: number;
}

export interface WaveConfig {
    coordinateMode: CoordinateMode;
    edgeA: { top: P5Lib.Vector; bottom: P5Lib.Vector; };
    edgeB: { top: P5Lib.Vector; bottom: P5Lib.Vector; };
    waveFill: WaveFill;
    pointSizeSelector: CategorySelector<PointSize>;
    amplitudeType: AmplitudeType;
}

export class Wave implements CanvasRedrawListener {
    readonly #EDGE_A: WaveEdge;
    readonly #EDGE_B: WaveEdge;
    readonly #WAVE_FILL: WaveFill;
    readonly #POINT_SIZE_SELECTOR: CategorySelector<PointSize>;
    readonly #AMPLITUDE_TYPE: AmplitudeType;

    #rotation: number = 0;

    #points: Point[] = [];

    public constructor(config: WaveConfig) {
        this.#EDGE_A = new WaveEdge(config.edgeA.top, config.edgeA.bottom, config.coordinateMode);
        this.#EDGE_B = new WaveEdge(config.edgeB.top, config.edgeB.bottom, config.coordinateMode);
        this.#WAVE_FILL = config.waveFill;
        this.#AMPLITUDE_TYPE = config.amplitudeType;
        this.#POINT_SIZE_SELECTOR = config.pointSizeSelector;

        this.#updateRotation();
        this.#buildPoints();
    }

    public canvasRedraw(): void {
        this.#EDGE_A.remap();
        this.#EDGE_B.remap();
        this.#updateRotation();
        this.#updatePoints();
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        const center_A: P5Lib.Vector = this.#EDGE_A.center;

        p5.push();
        p5.translate(center_A.x, center_A.y);
        p5.rotate(this.#rotation);

        this.#points.forEach((point: Point): void => {
            point.draw();
        });

        p5.pop();
    }

    public move(): void {
        this.#points.forEach((point: Point): void => {
            point.move();
        });
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

    #buildPoints(): void {
        const p5: P5Lib = P5Context.p5;
        const pointTotal: number = 25;
        const data: WaveData = this.#getWaveData();
        const start: P5Lib.Vector = p5.createVector(0, 0);
        const end: P5Lib.Vector = p5.createVector(data.length, 0);
        let theta: number = 0;

        if (this.#WAVE_FILL === WaveFill.OVERLAP) {
            const spacing: number = 1.0 / pointTotal;
            const offset: number = spacing / 2.0;

            for (let i: number = 0; i < pointTotal; i++) {
                const waveRatioSize: number = this.#POINT_SIZE_SELECTOR.getChoice();
                const waveRatioStart: number = (offset + (i * spacing)) - (waveRatioSize / 2.0);
                const waveRatioEnd: number = (offset + (i * spacing)) + (waveRatioSize / 2.0);

                const point: Point = this.#buildPoint(
                    start,
                    end,
                    data.length,
                    waveRatioStart,
                    waveRatioEnd,
                    waveRatioSize,
                    theta,
                    0.01,
                    data.amplitude_A,
                    data.amplitude_B
                );

                this.#points.push(point);
            }
        } else {
            let waveRatioStart: number = 0;
            let waveRatioEnd: number = 0;
            const minPointSize: number = this.#POINT_SIZE_SELECTOR.getCurrentCategoryRange()?.min ?? 0;

            while (waveRatioStart < 1) {
                const waveRatioSize: number = this.#POINT_SIZE_SELECTOR.getChoice();
                waveRatioEnd = waveRatioStart + waveRatioSize;

                if (1 - waveRatioEnd < minPointSize) {
                    console.log('end end end');
                    waveRatioEnd = 1;
                }

                const point: Point = this.#buildPoint(
                    start,
                    end,
                    data.length,
                    waveRatioStart,
                    waveRatioEnd,
                    waveRatioSize,
                    theta,
                    0.01,
                    data.amplitude_A,
                    data.amplitude_B
                );

                this.#points.push(point);

                waveRatioStart = waveRatioEnd;
            }
        }
    }

    #buildPoint(waveStart: P5Lib.Vector,
                waveEnd: P5Lib.Vector,
                waveLength: number,
                waveRatioStart: number,
                waveRatioEnd: number,
                waveRatioSize: number,
                initialTheta: number,
                deltaTheta: number,
                amplitude_A: number,
                amplitude_B: number): Point {
        const p5: P5Lib = P5Context.p5;
        const waveRatioCenter: number = (waveRatioStart + waveRatioEnd) / 2;
        let diameter: number = waveLength * waveRatioSize;
        const base: P5Lib.Vector = P5Lib.Vector.lerp(waveStart, waveEnd, waveRatioCenter);
        const theta: number = initialTheta + (waveRatioCenter * (Math.PI * 2));

        const amplitudeMap: number = p5.map(waveRatioCenter, 0, 1, amplitude_A, amplitude_B);
        let amplitude: number;

        if (this.#AMPLITUDE_TYPE === AmplitudeType.EDGE) {
            amplitude = amplitudeMap - (diameter / 2.0);

            if (Math.ceil(amplitude) < 0) {
                amplitude = 0;
                diameter = amplitudeMap * 2;
            }
        } else {
            amplitude = amplitudeMap;
        }

        const pointConfig: PointConfig = {
            waveRatio_start: waveRatioStart,
            waveRatio_end: waveRatioEnd,
            base: base,
            diameter: diameter,
            theta: theta,
            deltaTheta: deltaTheta,
            amplitude: amplitude
        };

        return new Point(pointConfig);
    }

    #updatePoints(): void {
        const p5: P5Lib = P5Context.p5;
        const data: WaveData = this.#getWaveData();
        const start: P5Lib.Vector = p5.createVector(0, 0);
        const end: P5Lib.Vector = p5.createVector(data.length, 0);

        this.#points.forEach((point: Point): void => {
            let diameter: number = data.length * point.getWaveRatioLength();
            const base: P5Lib.Vector = P5Lib.Vector.lerp(start, end, point.getWaveRatioCenter());
            const amplitudeMap: number = p5.map(point.getWaveRatioCenter(), 0, 1, data.amplitude_A, data.amplitude_B);
            let amplitude: number;

            if (this.#AMPLITUDE_TYPE === AmplitudeType.EDGE) {
                amplitude = amplitudeMap - (diameter / 2.0);

                if (Math.ceil(amplitude) < 0) {
                    amplitude = 0;
                    diameter = amplitudeMap * 2;
                }
            } else {
                amplitude = amplitudeMap;
            }

            point.updateBase(base);
            point.updateDiameter(diameter);
            point.updateAmplitude(amplitude);
        });
    }

    #getWaveData(): WaveData {
        const center_A: P5Lib.Vector = this.#EDGE_A.center;
        const center_B: P5Lib.Vector = this.#EDGE_B.center;
        const amplitude_A: number = this.#EDGE_A.length / 2.0;
        const amplitude_B: number = this.#EDGE_B.length / 2.0;
        const length: number = center_A.dist(center_B);

        return {
            amplitude_A: amplitude_A,
            amplitude_B: amplitude_B,
            length: length
        }
    }

    public debug_drawFrame(border: number): void {
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
