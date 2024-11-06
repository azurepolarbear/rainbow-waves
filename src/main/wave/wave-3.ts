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

import {CanvasContext, CanvasRedrawListener, Coordinate, CoordinateMode, P5Context} from "@batpb/genart";
import P5Lib from "p5";

class Edge {
    public readonly top: Coordinate = new Coordinate();
    public readonly bottom: Coordinate = new Coordinate();

    public center(): P5Lib.Vector {
        return P5Lib.Vector.lerp(this.top.position, this.bottom.position, 0.5);
    }

    public remap(): void {
        this.top.remap();
        this.bottom.remap();
    }
}

export class Wave implements CanvasRedrawListener {
    readonly #edge_A: Edge = new Edge();
    readonly #edge_B: Edge = new Edge();

    #rotation: number = 0;

    public set_edge_A(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        this.#edge_A.top.position = top;
        this.#edge_A.bottom.position = bottom;
        this.#updateRotation();
        return this;
    }

    public set_edge_B(top: P5Lib.Vector, bottom: P5Lib.Vector): Wave {
        this.#edge_B.top.position = top;
        this.#edge_B.bottom.position = bottom;
        this.#updateRotation();
        return this;
    }

    #updateRotation(): void {
        const p5: P5Lib = P5Context.p5;
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        const center_A: P5Lib.Vector = this.#edge_A.center();
        const translated_B: P5Lib.Vector = P5Lib.Vector.sub(this.#edge_B.center(), center_A);
        p5.push();
        p5.translate(center_A.x, center_A.y);
        this.#rotation = translated_B.heading();
        p5.pop();
    }

    draw(): void {
        this.#debug_drawFrame();
    }

    public canvasRedraw(): void {
        this.#edge_A.remap();
        this.#edge_B.remap();
        this.#updateRotation();
    }

    #debug_drawFrame(): void {
        const p5: P5Lib = P5Context.p5;
        Coordinate.coordinateMode = CoordinateMode.CANVAS;
        p5.stroke(0);
        p5.strokeWeight(CanvasContext.defaultStroke);
        p5.noFill();
        p5.quad(this.#edge_A.top.x, this.#edge_A.top.y,
            this.#edge_B.top.x, this.#edge_B.top.y,
            this.#edge_B.bottom.x, this.#edge_B.bottom.y,
            this.#edge_A.bottom.x, this.#edge_A.bottom.y);

        p5.strokeWeight(CanvasContext.defaultStroke * 5);
        p5.stroke(0, 255, 0);
        const center_A: P5Lib.Vector = this.#edge_A.center();
        p5.point(center_A.x, center_A.y);

        p5.stroke(0, 0, 255);
        const center_B: P5Lib.Vector = this.#edge_B.center();
        p5.point(center_B.x, center_B.y);

        p5.strokeWeight(CanvasContext.defaultStroke * 2);
        p5.stroke(0, 255, 255);
        // const translated_B: P5Lib.Vector = P5Lib.Vector.sub(center_B, center_A);
        const dist: number = center_A.dist(center_B);
        p5.push();
        p5.translate(center_A.x, center_A.y);
        p5.rotate(this.#rotation);
        p5.line(0, 0, dist, 0);
        p5.pop();
    }
}
