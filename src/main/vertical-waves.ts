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

import {CanvasScreen, Color, ColorSelector, ColorSelectorType, CoordinateMode, P5Context, Random} from "@batpb/genart";
import {Wave, WaveConfig} from "./wave";
import P5Lib from "p5";
import p5 from "p5";

class RedSelector extends ColorSelector {
    public getColor(): Color {
        return undefined;
    }

    public get type(): ColorSelectorType {
        return undefined;
    }
}

export class VerticalWaves extends CanvasScreen {
    #wave: Wave;

    public constructor() {
        super('vertical waves');

        const config: WaveConfig = {
            coordinateMode: CoordinateMode.RATIO,
            edgeA: { top: p5.createVector(0.4, 0), bottom: p5.createVector(0.3, 0) },
            edgeB: { top: p5.createVector(0.4, 1), bottom: p5.createVector(0.3, 1) },
            pointTotal: 50,
            frequency: 2,
            deltaTheta: 0.005,
            initialTheta: 0,
            colorSelector: selector,
            pointSizeSelector: HorizontalWaves.#POINT_SIZE_SELECTOR,
            pointOverlap: pointOverlap
        };

        this.#wave = new Wave(config);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(0);
        this.#wave.draw();
        this.#wave.debug_drawFrame(255);
    }

    keyPressed(): void {
    }

    mousePressed(): void {
    }
}
