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

import {ASPECT_RATIOS, CanvasContext, CanvasScreen, Coordinate, CoordinateMode, P5Context, Random} from "@batpb/genart";
import {Wave} from "./wave";
import P5Lib from "p5";


// TYPES
//  - same point count
//  - same point speed
//  - same height
//  - same length (randomize lengths!)
//  - same starting theta
//  - same delta theta on all points in a wave
//  - same amplitude on all points in a wave
//  - same alignment on all points (starting x)

export class HorizontalWavesScreen extends CanvasScreen {
    readonly #WAVES: Wave[] = [];

    constructor() {
        super('horizontal waves');
        const p5: P5Lib = P5Context.p5;

        let yRatio: number = 0;
        let minWaves: number = 5;
        let maxWaves: number = 20;
        const minPoints: number = 10;
        const maxPoints: number = 150;

        while (yRatio < 1) {
            const hRatio: number = Random.randomFloat(1.0 / maxWaves, 1.0 / minWaves);
            const w: Wave = new Wave();
            Coordinate.coordinateMode = CoordinateMode.RATIO;

            let endY: number = yRatio + hRatio;

            if ((endY > 1) || ((1 - endY) < (1.0 / maxWaves))) {
                endY = 1;
            }

            w.build_setEdge_A(p5.createVector(0, yRatio), p5.createVector(0, endY));
            Coordinate.coordinateMode = CoordinateMode.RATIO;
            w.build_setEdge_B(p5.createVector(1, yRatio), p5.createVector(1, endY));
            w.build_setPointCount(Random.randomInt(minPoints, maxPoints));
            w.build_createPoints();
            this.#WAVES.push(w);
            this.addRedrawListener(w);
            yRatio = endY;
        }
    }

    public override draw(): void {
        P5Context.p5.background(220);
        this.#WAVES.forEach((w: Wave): void => {
            w.draw();
        });
    }

    public override keyPressed(): void {
        const p5: P5Lib = P5Context.p5;

        if (p5.key === '1') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SQUARE);
        } else if (p5.key === '2') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SOCIAL_VIDEO);
        } else if (p5.key === '3') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.WIDESCREEN);
        } else if (p5.key === '8') {
            CanvasContext.updateResolution(720);
        } else if (p5.key === '9') {
            CanvasContext.updateResolution(1080);
        } else if (p5.key === '0') {
            console.log(`framerate = ${p5.frameRate()}`);
        }
    }

    public override mousePressed(): void {
    }
}
