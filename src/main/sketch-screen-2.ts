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
    ASPECT_RATIOS, AspectRatioHandler,
    CanvasContext,
    CanvasScreen,
    Coordinate,
    CoordinateMode,
    P5Context, Random, ScreenHandler,
} from '@batpb/genart';
import {Wave} from './wave';
import P5Lib from "p5";

export class SketchScreen2 extends CanvasScreen {
    #waves: Wave[] = [];

    public constructor() {
        super('sketch2');

        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        let w: Wave = new Wave();
        w.build_setEdge_A(new P5Lib.Vector(10, 10), new P5Lib.Vector(10, 190))
            .build_setEdge_B(new P5Lib.Vector(290, 10), new P5Lib.Vector(290, 190))
        .build_setPointCount(Random.randomInt(20, 100))
        .build_createPoints();
        this.#waves.push(w);

        w = new Wave();
        w.build_setEdge_A(new P5Lib.Vector(300 + 75, 10), new P5Lib.Vector(300, 190))
            .build_setEdge_B(new P5Lib.Vector(590 - 75, 10), new P5Lib.Vector(590, 190))
        .build_setPointCount(Random.randomInt(20, 100))
        .build_createPoints();
        this.#waves.push(w);

        w = new Wave();
        w.build_setEdge_A(new P5Lib.Vector(10, 200), new P5Lib.Vector(290, 200))
            .build_setEdge_B(new P5Lib.Vector(10, 390), new P5Lib.Vector(290, 390))
        .build_setPointCount(Random.randomInt(20, 100))
        .build_createPoints();
        this.#waves.push(w);

        w = new Wave();
        w.build_setEdge_A(new P5Lib.Vector(300, 200), new P5Lib.Vector(300, 390 - 100))
            .build_setEdge_B(new P5Lib.Vector(590, 200), new P5Lib.Vector(590, 390))
        .build_setPointCount(Random.randomInt(20, 100))
        .build_createPoints();
        this.#waves.push(w);

        w = new Wave();
        w.build_setEdge_A(new P5Lib.Vector(10, 400 + 100), new P5Lib.Vector(10, 590))
            .build_setEdge_B(new P5Lib.Vector(290, 400), new P5Lib.Vector(290, 590 - 50))
        .build_setPointCount(Random.randomInt(20, 100))
        .build_createPoints();
        this.#waves.push(w);

        w = new Wave();
        w.build_setEdge_A(new P5Lib.Vector(300, 400), new P5Lib.Vector(300 + 75, 590))
            .build_setEdge_B(new P5Lib.Vector(590, 400), new P5Lib.Vector(590 - 75, 590))
        .build_setPointCount(Random.randomInt(20, 100))
        .build_createPoints();
        this.#waves.push(w);

        this.#waves.forEach((w: Wave): void => {
            this.addRedrawListener(w);
        });
    }

    public draw(): void {
        P5Context.p5.background(220);
        this.#waves.forEach((w: Wave): void => {
            w.draw();
        })
    }

    public keyPressed(): void {
        const p5: P5Lib = P5Context.p5;

        if (p5.key === '1') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SQUARE);
        } else if (p5.key === '2') {
            CanvasContext.updateAspectRatio(ASPECT_RATIOS.SOCIAL_VIDEO);
        } else if (p5.key === '3') {
            CanvasContext.updateAspectRatio(AspectRatioHandler.buildAspectRatio(16, 9) ?? ASPECT_RATIOS.SQUARE);
        } else if (p5.key === '4') {
            ScreenHandler.currentScreen = 'sketch';
        } else if (p5.key === '0') {
            console.log(`framerate = ${p5.frameRate()}`);
        }
    }

    public mousePressed(): void {
        console.log('mousePressed');
    }
}
