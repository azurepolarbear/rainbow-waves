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

import {
    ASPECT_RATIOS, AspectRatio,
    CanvasContext,
    CanvasScreen,
    Color,
    P5Context,
    Random,
    Range,
    ScreenHandler
} from '@batpb/genart';

import { PointDensity, PointSize, Wave } from './wave';

import { CategorySelector } from './category-selector';
import { ScreenName } from './screen-name';

export abstract class WaveScreen extends CanvasScreen {
    static readonly #POINT_SIZE_SELECTOR: CategorySelector<PointSize> = new CategorySelector<PointSize>([
        { category: PointSize.SMALL, range: new Range(1.0 / 250.0, 1.0 / 75.0) },
        { category: PointSize.MEDIUM, range: new Range(1.0 / 75.0, 1.0 / 25.0) },
        { category: PointSize.LARGE, range: new Range(1 / 25.0, 1.0 / 4.0) },
        { category: PointSize.MIXED, range: new Range(1.0 / 250.0, 1.0 / 4.0) }
    ], Random.randomBoolean());

    static readonly #POINT_DENSITY_SELECTOR: CategorySelector<PointDensity> = new CategorySelector<PointDensity>([
        { category: PointDensity.LOW, range: new Range(4, 25) },
        { category: PointDensity.MEDIUM, range: new Range(25, 75) },
        { category: PointDensity.HIGH, range: new Range(75, 250) }
    ], Random.randomBoolean());

    readonly #WAVES: Wave[] = [];

    #background: Color;

    #constantPointSizeCategory: boolean = true;
    #constantPointSize: boolean = true;

    #constantPointDensityCategory: boolean = true;
    #constantPointDensity: boolean = true;

    protected constructor(name: string) {
        super(name);
        this.#background = new Color(0, 0, 0);
    }

    public static get POINT_DENSITY_SELECTOR(): CategorySelector<PointDensity> {
        return WaveScreen.#POINT_DENSITY_SELECTOR;
    }

    public static get POINT_SIZE_SELECTOR(): CategorySelector<PointSize> {
        return WaveScreen.#POINT_SIZE_SELECTOR;
    }

    public get sameWaveAmplitude(): boolean {
        return true;
    }

    public get sameWaveDeltaTheta(): boolean {
        return true;
    }

    public get sameWaveInitialTheta(): boolean {
        return true;
    }

    public get sameWaveFrequency(): boolean {
        return true;
    }

    protected get constantPointDensityCategory(): boolean {
        return this.#constantPointDensityCategory;
    }

    protected set constantPointDensityCategory(value: boolean) {
        this.#constantPointDensityCategory = value;
    }

    protected get constantPointDensity(): boolean {
        return this.#constantPointDensity;
    }

    protected set constantPointDensity(value: boolean) {
        this.#constantPointDensity = value;
    }

    protected get constantPointSizeCategory(): boolean {
        return this.#constantPointSizeCategory;
    }

    protected set constantPointSizeCategory(value: boolean) {
        this.#constantPointSizeCategory = value;
    }

    protected get constantPointSize(): boolean {
        return this.#constantPointSize;
    }

    protected set constantPointSize(value: boolean) {
        this.#constantPointSize = value;
    }

    public override activate(): void {
        super.activate();
        P5Context.p5.background(this.#background.color);
    }

    public keyPressed(): void {
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
            ScreenHandler.currentScreen = ScreenName.HORIZONTAL_WAVES;
        } else if (p5.key === 's') {
            ScreenHandler.currentScreen = ScreenName.VERTICAL_WAVES;
        } else if (p5.key === 'd') {
            ScreenHandler.currentScreen = ScreenName.WAVE_TESTING;
        } else if (p5.key === 'z') {
            this.saveSocialMediaSet(1_000)
                .then(
                    (): void => {
                        console.log('Social media set saved.');
                    },
                    (): void => {
                        console.error('Error saving social media set.');
                    }
                );
        }

        p5.background(this.#background.color);
    }

    public mousePressed(): void {
        console.log('mousePressed() placeholder');
    }

    protected updatePointSizeSelector(): void {
        if (!this.constantPointSizeCategory) {
            WaveScreen.#POINT_SIZE_SELECTOR.setRandomCategory();
        }

        if (!this.constantPointSize) {
            WaveScreen.#POINT_SIZE_SELECTOR.resetChoice();
        }
    }

    protected updatePointDensitySelector(): void {
        if (!this.constantPointDensityCategory) {
            WaveScreen.#POINT_DENSITY_SELECTOR.setRandomCategory();
        }

        if (!this.constantPointDensity) {
            WaveScreen.#POINT_DENSITY_SELECTOR.resetChoice();
        }
    }

    protected addWave(wave: Wave): void {
        this.#WAVES.push(wave);
        this.addRedrawListener(wave);
    }

    protected renderWaves(): void {
        for (const wave of this.#WAVES) {
            wave.draw();
            wave.move();
        }
    }

    protected debugWaves(): void {
        for (const wave of this.#WAVES) {
            wave.debug_drawFrame(255);
        }
    }

    // TODO - add functionality to @batpb/genart library
    protected async saveSocialMediaSet(timeout: number): Promise<void> {
        const ratios: AspectRatio[] = [
            ASPECT_RATIOS.SQUARE,
            ASPECT_RATIOS.PINTEREST_PIN,
            ASPECT_RATIOS.TIKTOK_PHOTO,
            ASPECT_RATIOS.SOCIAL_VIDEO,
            ASPECT_RATIOS.WIDESCREEN
        ];

        let count: number = 1;
        for (const ratio of ratios) {
            await this.#saveAspectRatio(ratio, count, timeout)
                .then((): void => {
                    console.log(`Saved ${ratio.NAME}.`);
                });

            count++;
        }

        CanvasContext.updateAspectRatio(ASPECT_RATIOS.SQUARE);
    }

    async #saveAspectRatio(ratio: AspectRatio, count: number, timeout: number): Promise<void> {
        const p5: P5Lib = P5Context.p5;

        CanvasContext.updateAspectRatio(ratio);
        await new Promise<void>((f: (value: void | PromiseLike<void>) => void): void => {
            setTimeout(f, timeout);
        });

        p5.save(`${this.NAME}_0${count}_${ratio.NAME}.png`);
        await new Promise<void>((f: (value: void | PromiseLike<void>) => void): void => {
            setTimeout(f, timeout);
        });
    }
}
