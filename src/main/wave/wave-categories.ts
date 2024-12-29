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

/**
 * The size of the points in a wave.
 * This determines the number of points in a {@link WaveFill.FILL} wave.
 */
export enum PointSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    MIXED = 'mixed'
}

/**
 * The number of points in a wave.
 * This determines the number of points in a {@link WaveFill.OVERLAP} wave.
 */
export enum PointDensity {
    LOW = 0, // 4-25 points
    MEDIUM = 1, // 25-75 points
    HIGH = 2 // 75-250 points
}

export enum WaveFill {
    /**
     * Wave points are built to fill in the wave without overlapping.
     */
    FILL = 'fill',

    /**
     * Wave points are built equidistant from each other and can overlap.
     */
    OVERLAP = 'overlap'
}

export enum AmplitudeType {
    /**
     * Amplitude is calculated from the edge of the wave points.
     */
    EDGE = 'edge',

    /**
     * Amplitude is calculated from the center of the wave points.
     */
    CENTER = 'center'
}

export enum WaveDensity {
    LOW = 0, // 1-10 waves
    MEDIUM = 1, // 10-25 waves
    HIGH = 2 // 25-100 waves
}

export enum PointType {
    CIRCLE = 'circle',
    SQUARE = 'square',
    MIXED = 'mixed'
}
