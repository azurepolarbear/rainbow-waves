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
    P5Context
} from '@batpb/genart';

import { ScreenName } from './screen-name';
import { WaveScreen } from './wave-screen';

export class HorizontalWaves extends WaveScreen {
    constructor() {
        super(ScreenName.HORIZONTAL_WAVES);
        // TODO - wave density categories
        // const minWaves: number = 1;
        // const maxWaves: number = 20;

        // constant amplitude?

        // constant frequency?
    }

    public override draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(0);
    }
}
