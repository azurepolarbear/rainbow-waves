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

import {
    CanvasScreen,
    Color,
    ColorSelector,
    ColorSelectorType,
    CoordinateMode,
    P5Context,
    Random,
    Range, ScreenHandler
} from "@batpb/genart";
import {Wave, WaveConfig} from "./wave";
import P5Lib from "p5";
import {CategorySelector} from "./category-selector";
import {PointSize} from "./wave/wave-categories";

class RedSelector extends ColorSelector {
    public constructor() {
        super('red');
    }

    public getColor(): Color {
        return new Color(255, 0, 0);
    }

    public get type(): ColorSelectorType {
        return ColorSelectorType.RGB;
    }
}

export class VerticalWaves extends CanvasScreen {
    static readonly #POINT_SIZE_SELECTOR: CategorySelector<PointSize> = new CategorySelector<PointSize>([
        {category: PointSize.SMALL, range: new Range(1, 10)},
        {category: PointSize.MEDIUM, range: new Range(10, 25)},
        {category: PointSize.LARGE, range: new Range(25, 100)},
        {category: PointSize.MIXED, range: new Range(1, 100)}
    ], Random.randomBoolean());

    #wave: Wave;

    public constructor() {
        super('vertical waves');
        const p5: P5Lib = P5Context.p5;

        const config: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0.4, 0), bottom: p5.createVector(0.3, 0) },
            edgeB: { top: p5.createVector(0.4, 1), bottom: p5.createVector(0.3, 1) },
            pointTotal: 50,
            frequency: 2,
            deltaTheta: 0.005,
            initialTheta: 0,
            colorSelector: new RedSelector(),
            pointSizeSelector: VerticalWaves.#POINT_SIZE_SELECTOR,
            pointOverlap: true
        };

        this.#wave = new Wave(config);
        this.addRedrawListener(this.#wave);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(0);
        this.#wave.draw();
        this.#wave.debug_drawFrame(255);
    }

    keyPressed(): void {
        const p5: P5Lib = P5Context.p5;
        if (p5.key === 'a') {
            ScreenHandler.currentScreen = 'horizontal waves';
        }
    }

    mousePressed(): void {
    }
}
