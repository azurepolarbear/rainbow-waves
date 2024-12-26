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

import {
    ALL_PALETTES,
    ASPECT_RATIOS,
    CanvasContext,
    CanvasScreen,
    ColorSelector,
    ColorSelectorManager,
    CoordinateMapper,
    CoordinateMode,
    P5Context,
    PaletteColorSelector,
    Random,
    Range, ScreenHandler
} from '@batpb/genart';

import {Wave, WaveConfig} from './wave';
import {PointSize} from "./wave/wave-categories";
import {CategorySelector} from "./category-selector";

export class HorizontalWaves extends CanvasScreen {
    static readonly #POINT_SIZE_SELECTOR: CategorySelector<PointSize> = new CategorySelector<PointSize>([
        {category: PointSize.SMALL, range: new Range(1, 10)},
        {category: PointSize.MEDIUM, range: new Range(10, 25)},
        {category: PointSize.LARGE, range: new Range(25, 100)},
        {category: PointSize.MIXED, range: new Range(1, 100)}
    ], Random.randomBoolean());

    readonly #WAVES: Wave[] = [];

    readonly #backgroundAlpha: number = 10;

    constructor() {
        super('horizontal waves');
        const p5: P5Lib = P5Context.p5;

        this.#backgroundAlpha = Random.randomInt(5, 75);

        // const minWaves: number = 1;
        // const maxWaves: number = 100;
        const minWaves: number = 1;
        const maxWaves: number = 5;
        const minPoints: number = 10;
        const maxPoints: number = 150;
        // const minFrequency: number = 1;
        // const maxFrequency: number = 1;
        const minDeltaTheta: number = 0.005;
        const maxDeltaTheta: number = 0.05;

        const wavesTotal: number = Random.randomInt(minWaves, maxWaves);

        const manager = new ColorSelectorManager();
        manager.addColorSelectors(this.#colorSelectors());
        const selector: ColorSelector = manager.getRandomColorSelector();

        const constantPointSize: boolean = false;
        const constantPointCategory: boolean = false;
        HorizontalWaves.#POINT_SIZE_SELECTOR.sameChoice = constantPointSize;
        HorizontalWaves.#POINT_SIZE_SELECTOR.currentCategory = PointSize.LARGE;

        const pointOverlap: boolean = false;
        // const constantPointOverlap: boolean = true; // TODO - implement

        let startYRatio: number = Random.randomFloat(-0.1, 0.01);
        let endYRatio: number = 0;

        while (endYRatio < 1) {
            const minHRatio: number = (1.0 / maxWaves) * 0.5;
            const maxHRatio: number = (1.0 / wavesTotal) * 1.5;
            const hRatio: number = Random.randomFloat(minHRatio, maxHRatio);

            endYRatio = startYRatio + hRatio;

            if (!constantPointCategory) {
                HorizontalWaves.#POINT_SIZE_SELECTOR.setRandomCategory();
            }

            if (!constantPointSize) {
                HorizontalWaves.#POINT_SIZE_SELECTOR.resetChoice();
            }

            const config: WaveConfig = {
                coordinateMode: CoordinateMode.RATIO,
                edgeA: { top: p5.createVector(0, startYRatio), bottom: p5.createVector(0, endYRatio) },
                edgeB: { top: p5.createVector(1, startYRatio), bottom: p5.createVector(1, endYRatio) },
                pointTotal: Random.randomInt(minPoints, maxPoints),
                // frequency: Random.randomFloat(minFrequency, maxFrequency),
                frequency: 2,
                deltaTheta: Random.randomFloat(minDeltaTheta, maxDeltaTheta),
                initialTheta: Random.randomFloat(0, p5.TWO_PI),
                colorSelector: selector,
                pointSizeSelector: HorizontalWaves.#POINT_SIZE_SELECTOR,
                pointOverlap: pointOverlap
            };

            const w: Wave = new Wave(config);
            this.#WAVES.push(w);
            this.addRedrawListener(w);

            startYRatio = endYRatio;
        }

        p5.background(0);
    }

    public override draw(): void {
        const p5: P5Lib = P5Context.p5;

        p5.noStroke();
        p5.fill(0, this.#backgroundAlpha);
        p5.rectMode(p5.CORNER);
        p5.rect(CoordinateMapper.minX - 10, CoordinateMapper.minY - 10, p5.width + 20, p5.height + 20);

        this.#WAVES.forEach((w: Wave): void => {
            w.draw();
            w.debug_drawFrame(255);
        });
    }

    public override keyPressed(): void {
        const p5: P5Lib = P5Context.p5;

        if (p5.key === '1') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SQUARE);
        } else if (p5.key === '2') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.PINTEREST_PIN);
        } else if (p5.key === '3') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.TIKTOK_PHOTO);
        } else if (p5.key === '4') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SOCIAL_VIDEO);
        } else if (p5.key === '5') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.WIDESCREEN);
        } else if (p5.key === '8') {
            CanvasContext.updateResolution(720);
        } else if (p5.key === '9') {
            CanvasContext.updateResolution(1080);
        } else if (p5.key === '0') {
            console.log(`framerate = ${p5.frameRate()}`);
        } else if (p5.key === 'a') {
            ScreenHandler.currentScreen = 'vertical waves';
        }

        p5.background(0);
    }

    public override mousePressed(): void {
        console.log('mouse pressed');
    }

    #colorSelectors(): PaletteColorSelector[] {
        const selectors: PaletteColorSelector[] = [];

        for (const p of ALL_PALETTES.values) {
            selectors.push(new PaletteColorSelector(p));
        }

        return selectors;
    }
}
