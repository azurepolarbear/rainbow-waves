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

import { Coordinate, CoordinateMode } from '@batpb/genart';

export class WaveEdge {
    readonly #top: Coordinate;
    readonly #bottom: Coordinate;

    public constructor(top: P5Lib.Vector, bottom: P5Lib.Vector, mode: CoordinateMode) {
        this.#top = new Coordinate();
        this.#top.setPosition(top, mode)
        this.#bottom = new Coordinate();
        this.#bottom.setPosition(bottom, mode);
    }

    public get center(): P5Lib.Vector {
        return P5Lib.Vector.lerp(this.top, this.bottom, 0.5);
    }

    public get length(): number {
        return P5Lib.Vector.dist(this.top, this.bottom);
    }

    public get bottom(): P5Lib.Vector {
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        return (new P5Lib.Vector(this.#bottom.getX(mode), this.#bottom.getY(mode)));
    }

    public get top(): P5Lib.Vector {
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        return (new P5Lib.Vector(this.#top.getX(mode), this.#top.getY(mode)));
    }

    public remap(): void {
        this.#top.remap();
        this.#bottom.remap();
    }

    public update(top: P5Lib.Vector, bottom: P5Lib.Vector, mode: CoordinateMode): void {
        this.#top.setPosition(top, mode);
        this.#bottom.setPosition(bottom, mode);
    }
}
