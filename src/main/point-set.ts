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

import P5Lib from "p5";
import { Color } from "@batpb/genart";

interface PointData {
    base: P5Lib.Vector;
    position: P5Lib.Vector;
    theta: number;
    amplitude: number;
    color: Color;
}

export interface PointSetConfig {
    readonly base: P5Lib.Vector;
    readonly amplitude: number;
    readonly theta: number;
    readonly deltaTheta: number;
    readonly color: Color;
    readonly totalPoints: number;
    readonly evenDistribution: boolean;
}

export class PointSet {
    deltaTheta: number;
    angleLength: number;
    totalPoints: number;
    points: PointData[] = [];

    constructor(config: PointSetConfig) {
        this.totalPoints = config.totalPoints;
        this.deltaTheta = config.deltaTheta;
        this.angleLength = Math.PI;
        let t: number = config.theta;
        const minAlpha: number = 25;
        let a: number = 255;

        for (let i: number = 0; i < this.totalPoints; i++) {
            const c: Color = new Color(config.color);
            c.alpha = a;

            this.points.push({
                base: config.base,
                position: config.base.copy(),
                theta: t,
                amplitude: config.amplitude,
                color: c
            });

            // TODO - even distribution?
            t += this.angleLength / this.totalPoints;
            a -= 255 / this.totalPoints;

            if (a < minAlpha) {
                break;
            }
        }
    }

    public render(graphics: P5Lib.Graphics): void {
        graphics.beginShape();
        this.points.forEach((pointData: PointData): void => {
            graphics.stroke(pointData.color.color);
            graphics.strokeWeight(4);
            graphics.vertex(pointData.position.x, pointData.position.y);
        });
        graphics.endShape();
    }

    public update(): void {

    }
}
