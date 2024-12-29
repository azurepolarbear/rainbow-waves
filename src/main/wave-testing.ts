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

import {CoordinateMode, P5Context} from '@batpb/genart';

import {AmplitudeType, PointDensity, PointSize, Wave, WaveConfig, WaveFill} from './wave';
import {WaveScreen} from './wave-screen';
import {ScreenNames} from "./screen-names";

export class WaveTesting extends WaveScreen {
    #horizontalWave: Wave;
    #verticalWave: Wave;
    #diagonalWave: Wave;

    public constructor() {
        super(ScreenNames.WAVE_TESTING);
        const p5: P5Lib = P5Context.p5;

        WaveScreen.POINT_SIZE_SELECTOR.currentCategory = PointSize.MEDIUM;
        WaveScreen.POINT_SIZE_SELECTOR.sameChoice = false;

        WaveScreen.POINT_DENSITY_SELECTOR.currentCategory = PointDensity.MEDIUM;
        WaveScreen.POINT_DENSITY_SELECTOR.sameChoice = true;

        const hConfig: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0, 0.3), bottom: p5.createVector(0, 0.7) },
            edgeB: { top: p5.createVector(1, 0.4), bottom: p5.createVector(1, 0.6) },
            targetPointTotal: WaveScreen.POINT_DENSITY_SELECTOR.getChoice(),
            waveFill: WaveFill.OVERLAP,
            amplitudeType: AmplitudeType.CENTER,
            pointSizeSelector: WaveScreen.POINT_SIZE_SELECTOR
        };

        this.#horizontalWave = new Wave(hConfig);
        this.addRedrawListener(this.#horizontalWave);

        const vConfig: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0.4, 0), bottom: p5.createVector(0.6, 0) },
            edgeB: { top: p5.createVector(0.4, 1), bottom: p5.createVector(0.6, 1) },
            targetPointTotal: WaveScreen.POINT_DENSITY_SELECTOR.getChoice(),
            waveFill: WaveFill.FILL,
            amplitudeType: AmplitudeType.EDGE,
            pointSizeSelector: WaveScreen.POINT_SIZE_SELECTOR
        };

        this.#verticalWave = new Wave(vConfig);
        this.addRedrawListener(this.#verticalWave);

        const dConfig: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0, 0.1), bottom: p5.createVector(0.1, 0) },
            edgeB: { top: p5.createVector(0.9, 1), bottom: p5.createVector(1, 0.9) },
            targetPointTotal: WaveScreen.POINT_DENSITY_SELECTOR.getChoice(),
            waveFill: WaveFill.FILL,
            amplitudeType: AmplitudeType.EDGE,
            pointSizeSelector: WaveScreen.POINT_SIZE_SELECTOR
        };

        this.#diagonalWave = new Wave(dConfig);
        this.addRedrawListener(this.#diagonalWave);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(0);

        this.#horizontalWave.draw();
        this.#horizontalWave.debug_drawFrame(255);
        this.#horizontalWave.move();

        this.#verticalWave.draw();
        this.#verticalWave.debug_drawFrame(255);
        this.#verticalWave.move();

        this.#diagonalWave.draw();
        this.#diagonalWave.debug_drawFrame(255);
        this.#diagonalWave.move();
    }
}
