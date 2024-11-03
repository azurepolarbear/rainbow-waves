// /*
//  * Copyright (C) 2015-2024 brittni and the polar bear LLC.
//  *
//  * This file is a part of brittni and the polar bear's rainbow waves algorithmic art project,
//  * which is released under the GNU Affero General Public License, Version 3.0.
//  * You may not use this file except in compliance with the license.
//  *
//  * You should have received a copy of the GNU Affero General Public License
//  * along with this program. See LICENSE or go to
//  * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
//  *
//  * This program is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//  * See the GNU Affero General Public License for more details.
//  *
//  * The visual outputs of this source code are licensed under the
//  * Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//  * You should have received a copy of the CC BY-NC-ND 4.0 License with this program.
//  * See OUTPUT-LICENSE or go to https://creativecommons.org/licenses/by-nc-nd/4.0/
//  * for full license details.
//  */
//
// import P5Lib, {length} from "p5";
// import {Point} from "./point";
// import {CanvasRedrawListener, P5Context} from "@batpb/genart";
//
// export class Wave implements CanvasRedrawListener {
//     #base: P5Lib.Vector;
//     #length: number;
//     #amplitude: number;
//     #frequency: number;
//     #pointCount: number;
//     #deltaTheta: number;
//     readonly #points: Point[] = [];
//
//     constructor(base: P5Lib.Vector, length: number, amplitude: number, frequency: number, pointCount: number) {
//         this.#base = base;
//         this.#length = length;
//         this.#amplitude = amplitude;
//         this.#frequency = frequency;
//         this.#pointCount = pointCount;
//         this.#deltaTheta = 0.01;
//         this.#buildPoints();
//     }
//
//     #buildPoints(): void {
//         let theta: number = 0;
//
//         for (let i: number = 0; i < this.#pointCount; i++) {
//             const pointBase: P5Lib.Vector = new P5Lib.Vector();
//             pointBase.x = this.#base.x + (i * (this.#length / this.#pointCount));
//             pointBase.y = this.#base.y;
//             const point: Point = new Point(pointBase, theta, this.#amplitude, this.#deltaTheta);
//             this.#points.push(point);
//             theta += ((P5Context.p5.TWO_PI * this.#frequency) / this.#pointCount);
//         }
//     }
//
//     canvasRedraw(): void {
//         this.#points.forEach((point: Point): void => point.canvasRedraw());
//     }
//
//     draw(): void {
//     }
// }
