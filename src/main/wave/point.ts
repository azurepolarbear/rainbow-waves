// /*
//  * Copyright (C) 2024 brittni and the polar bear LLC.
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
// import {CanvasRedrawListener, Color, Coordinate, Point as PointShape} from '@batpb/genart'
// import P5Lib from "p5";
//
// export class Point implements CanvasRedrawListener {
//     #base: Coordinate = new Coordinate();
//     #point: PointShape;
//     #theta: number;
//     #amplitude: number;
//     #deltaTheta: number;
//
//     public constructor(base: P5Lib.Vector, theta: number, amp: number, deltaTheta: number) {
//         this.#base.position = base;
//         this.#theta = theta;
//         this.#amplitude = amp;
//         this.#deltaTheta = deltaTheta;
//         this.#point = new PointShape();
//         this.#updatePosition();
//         this.#point.stroke = new Color(255, 0, 0);
//     }
//
//     public draw(): void {
//         this.#point.draw();
//         this.update();
//     }
//
//     public update(): void {
//         this.#theta += this.#deltaTheta;
//     }
//
//     public canvasRedraw(): void {
//         this.#point.canvasRedraw();
//     }
//
//     #updatePosition(): void {
//         this.#point.x = this.#base.x;
//         this.#point.y = this.#calculateY();
//     }
//
//     #calculateY(): number {
//         return this.#base.y + (Math.sin(this.#theta) * this.#amplitude);
//     }
// }
