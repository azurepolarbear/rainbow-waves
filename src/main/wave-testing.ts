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

import { CoordinateMode, P5Context } from '@batpb/genart';

import { Wave, WaveConfig } from './wave';
import { WaveScreen } from './wave-screen';

export class WaveTesting extends WaveScreen {
    #horizontalWave: Wave;
    #verticalWave: Wave;
    #diagonalWave: Wave;

    public constructor() {
        super('wave testing');
        const p5: P5Lib = P5Context.p5;

        const hConfig: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0, 0.4), bottom: p5.createVector(0, 0.6) },
            edgeB: { top: p5.createVector(1, 0.4), bottom: p5.createVector(1, 0.6) }
        };

        this.#horizontalWave = new Wave(hConfig);

        console.log(this.#horizontalWave);

        const vConfig: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0.4, 0), bottom: p5.createVector(0.6, 0) },
            edgeB: { top: p5.createVector(0.4, 1), bottom: p5.createVector(0.6, 1) }
        };

        this.#verticalWave = new Wave(vConfig);

        console.log(this.#verticalWave);

        const dConfig: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0, 0.1), bottom: p5.createVector(0.1, 0) },
            edgeB: { top: p5.createVector(0.9, 1), bottom: p5.createVector(1, 0.9) }
        };

        this.#diagonalWave = new Wave(dConfig);

        console.log(this.#diagonalWave);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(0);
        this.#horizontalWave.debug_drawFrame(255);
        this.#verticalWave.debug_drawFrame(255);
        this.#diagonalWave.debug_drawFrame(255);
    }
}
