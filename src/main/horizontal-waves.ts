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

import {
    ALL_PALETTES,
    ASPECT_RATIOS,
    CanvasContext,
    CanvasScreen, ColorSelector, ColorSelectorManager,
    Coordinate,
    CoordinateMapper,
    CoordinateMode,
    P5Context,
    PaletteColorSelector,
    Random
} from "@batpb/genart";
import {Wave} from "./wave";
import P5Lib from "p5";

// Up Next
// - colors
// - choose palette
// - color selection choices
//     - random color selection
//     - in order (cycle)
//     - in order (mirror)
//     - mapped from 0 - TWO_PI
//     - mapped to random range
//     - mapped to full wave
//     - HSL mapped color
//     - RGB color
// - random buffer between waves (some waves may overlap)
// - random waves skipped

// TYPES
//  - same point count
//  - same point speed
//  - same height
//  - same length (randomize lengths!)
//  - same starting theta
//  - same palette, color selection, and mapping
//  - same palette and color selection
//  - same palette
//  - same color selection type (HSL, RGB, Palette)
//  - same alignment on all points (starting x)
//  - same delta theta on all points in a wave
//  - same amplitude on all points in a wave
//  - same spacing on all points in a wave
//  - same size on all points in a wave
//  - same buffer between waves
//  - regular interval of waves skipped
//  - no waves skipped
//  - no waves overlapping

export class HorizontalWavesScreen extends CanvasScreen {
    readonly #WAVES: Wave[] = [];

    readonly #backgroundAlpha: number = 10;

    constructor() {
        super('horizontal waves');
        const p5: P5Lib = P5Context.p5;

        this.#backgroundAlpha = Random.randomInt(5, 75);

        let yRatio: number = 0;
        let minWaves: number = 5;
        let maxWaves: number = 30;
        const minPoints: number = 10;
        const maxPoints: number = 150;
        const minFrequency: number = 0.5;
        const maxFrequency: number = 10;
        const minDeltaTheta: number = 0.005;
        const maxDeltaTheta: number = 0.05;

        const manager = new ColorSelectorManager();
        manager.addColorSelectors(this.#colorSelectors());
        const selector: ColorSelector = manager.getRandomColorSelector();

        while (yRatio < 1) {
            const hRatio: number = Random.randomFloat(1.0 / maxWaves, 1.0 / minWaves);
            const w: Wave = new Wave();
            let endY: number = yRatio + hRatio;

            if ((endY > 1) || ((1 - endY) < (1.0 / maxWaves))) {
                endY = 1;
            }

            Coordinate.coordinateMode = CoordinateMode.RATIO;
            w.build_setEdge_A(p5.createVector(0, yRatio), p5.createVector(0, endY));

            Coordinate.coordinateMode = CoordinateMode.RATIO;
            w.build_setEdge_B(p5.createVector(1, yRatio), p5.createVector(1, endY));

            w.build_setPointCount(Random.randomInt(minPoints, maxPoints))
                .build_setFrequency(Random.randomFloat(minFrequency, maxFrequency))
                .build_setDeltaTheta(Random.randomFloat(minDeltaTheta, maxDeltaTheta))
                .build_setInitialTheta(Random.randomFloat(0, p5.TWO_PI))
                .build_setColorSelector(selector);

            w.build_createPoints();
            this.#WAVES.push(w);
            this.addRedrawListener(w);
            yRatio = endY + 0.01;
        }
    }

    public override draw(): void {
        const p5: P5Lib = P5Context.p5;

        p5.noStroke();
        p5.fill(0, this.#backgroundAlpha);
        p5.rectMode(p5.CORNER);
        p5.rect(CoordinateMapper.minX - 10, CoordinateMapper.minY - 10, p5.width + 20, p5.height + 20);

        this.#WAVES.forEach((w: Wave): void => {
            w.draw();
            // w.debug_drawFrame(255);
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

    #colorSelectors(): PaletteColorSelector[] {
        const selectors: PaletteColorSelector[] = [];

        for (const p of ALL_PALETTES.values) {
            selectors.push(new PaletteColorSelector(p));
        }

        return selectors;
    }
}
