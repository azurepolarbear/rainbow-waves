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

// TODO - colors
// TODO - choose palette
// TODO - color selection choices
//     - random color selection
//     - in order (cycle)
//     - in order (mirror)
//     - mapped from 0 - TWO_PI
//     - mapped to random range
//     - mapped to full wave
//     - HSL mapped color
//     - RGB color
// TODO - random buffer between waves (some waves may overlap)
// TODO - random waves skipped

// TODO - Wave Types
//  - same point count
//  - same point speed
//  - same height
//  - same length (randomize lengths!)
//  - same starting theta
//  - same palette, color selection, and mapping
//  - same palette and color selection
//  - same palette
//  - same color selection type (HSL, RGB, Palette)
//  - same alignment on all points (starting x)
//  - same delta theta on all points in a wave
//  - same amplitude on all points in a wave
//  - same spacing on all points in a wave
//  - same size on all points in a wave
//  - same buffer between waves
//  - regular interval of waves skipped
//  - no waves skipped
//  - no waves overlapping

// TODO - points
// TODO     - alpha display (mixed or constant)
// TODO     - point weight (same or different)
// TODO     - point weight overlapping or buffered
// TODO     - wave buffer dependent on maximum point buffer

// TODO - special waves
// TODO     - overlapping mirroring waves (same amp or different amp)
// TODO     - overlapping random  waves
// TODO     - overlapping waves (same frequency, different amplitudes)
// TODO     - overlapping waves (half frequency, twice frequency, half amplitude, twice amplitude)

// TODO - layouts
// TODO     - horizontal
// TODO     - vertical
// TODO     - overlapping horizontal and vertical
// TODO     - only show waves within a circle (how do we show a pattern only in a circle or polygon area?)ß
// TODO     - diagonal
// TODO     - gabriel graph
// TODO     - random geometric graph (maybe?)
// TODO     - mixed layouts on one canvas (separated by grids or lattices?)

// TODO - patterns
// TODO     - steadily increasing/decreasing amp
// TODO     - steadily increasing/decreasing frequency
// TODO     - set pattern of amp multiplication
// TODO     - set pattern of frequency
// TODO     - set pattern of wave type (special wave)

// TODO - graph point distributions
// TODO     - square
// TODO     - circle
// TODO     - poisson distribution (code train tutorial)
// TODO     - square lattice
// TODO     - equilateral triangle lattice
// TODO     - hexagon lattice
// TODO     - rhombic lattice
// TODO     - rectangular lattice
// TODO     - oblique lattice
