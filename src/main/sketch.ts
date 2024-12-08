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

import P5Lib from 'p5';

import '../../assets/styles/sketch.css';

import {
    ALL_PALETTES,
    ColorSelector,
    ColorSelectorManager,
    CoordinateMode, P5Context,
    PaletteColorSelector,
    Random
} from "@batpb/genart";
import {Wave, WaveConfig} from "./wave";

function sketch(p5: P5Lib): void {
    let graphics: P5Lib.Graphics;
    let waves: Wave[] = [];

    p5.setup = (): void => {
        P5Context.initialize(p5);
        p5.createCanvas(500, 500);
        graphics = p5.createGraphics(500, 500);
        const buffer: number = 0.01;
        let yRatio: number = buffer;
        let loopY: number = yRatio;
        const minWaves: number = 2;
        const maxWaves: number = 5;
        const minPoints: number = 10;
        const maxPoints: number = 150;
        const minFrequency: number = 0.5;
        const maxFrequency: number = 10;
        const minDeltaTheta: number = 0.005;
        const maxDeltaTheta: number = 0.05;

        const manager = new ColorSelectorManager();
        manager.addColorSelectors(colorSelectors());
        const selector: ColorSelector = manager.getRandomColorSelector();

        while (loopY < (1 - buffer)) {
            const hRatio: number = Random.randomFloat(1.0 / maxWaves, 1.0 / minWaves);
            let endY: number = yRatio + hRatio;

            if (((endY + buffer) > (1 - buffer)) || ((1 - (endY + buffer)) < (1.0 / maxWaves))) {
                endY = 1 - buffer;
            }

            const config: WaveConfig = {
                coordinateMode: CoordinateMode.RATIO,
                edgeA: { top: p5.createVector(0, yRatio), bottom: p5.createVector(0, endY) },
                edgeB: { top: p5.createVector(1, yRatio), bottom: p5.createVector(1, endY) },
                pointTotal: Random.randomInt(minPoints, maxPoints),
                frequency: Random.randomFloat(minFrequency, maxFrequency),
                deltaTheta: Random.randomFloat(minDeltaTheta, maxDeltaTheta),
                initialTheta: Random.randomFloat(0, p5.TWO_PI),
                colorSelector: selector
            };

            const w: Wave = new Wave(config);
            waves.push(w);
            // this.addRedrawListener(w);
            loopY = Math.max(endY + buffer, yRatio + hRatio);
            yRatio = endY + buffer;
        }
    };

    p5.draw = (): void => {
        graphics.background(0);
        for (const w of waves) {
            w.render(graphics);
        }
        p5.image(graphics, 0, 0);
        graphics.reset();
    };

    p5.keyPressed = (): void => {

    };

    p5.mousePressed = (): void => {
        console.log(p5.frameRate());
    };

    p5.windowResized = (): void => {

    };

    function colorSelectors(): PaletteColorSelector[] {
        const selectors: PaletteColorSelector[] = [];

        for (const p of ALL_PALETTES.values) {
            selectors.push(new PaletteColorSelector(p));
        }

        return selectors;
    }
}

new P5Lib(sketch);
