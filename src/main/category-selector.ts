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

import { Random, Range } from '@batpb/genart';

// TODO - add functionality to @batpb/genart library
export class CategorySelector<Type> {
    readonly #CHOICES: Map<Type, Range> = new Map<Type, Range>();

    #sameChoice: boolean;
    #currentCategory: Type;
    #choice: number | undefined = undefined;

    constructor(choices: { category: Type; range: Range; }[], sameChoice: boolean) {
        for (const choice of choices) {
            this.#CHOICES.set(choice.category, choice.range);
        }

        this.#sameChoice = sameChoice;
        this.#currentCategory = this.getRandomCategory();
    }

    public get currentCategory(): Type | undefined {
        return this.#currentCategory;
    }

    public set currentCategory(category: Type | undefined) {
        if (category) {
            this.#currentCategory = category;
        }
    }

    public get sameChoice(): boolean {
        return this.#sameChoice;
    }

    public set sameChoice(sameChoice: boolean) {
        this.#sameChoice = sameChoice;
    }

    public getRandomCategory(): Type {
        const keys: Type[] = Array.from(this.#CHOICES.keys());
        return Random.randomElement(keys) ?? keys[0];
    }

    public setRandomCategory(): void {
        const keys: Type[] = Array.from(this.#CHOICES.keys());
        this.resetChoice();
        this.#currentCategory = Random.randomElement(keys) ?? keys[0];
    }

    public resetChoice(): void {
        this.#choice = undefined;
    }

    public getCurrentCategoryRange(): Range | undefined {
        if (this.#currentCategory) {
            return this.#CHOICES.get(this.#currentCategory);
        } else {
            return undefined;
        }
    }

    public getChoice(): number {
        let result: number;

        if (this.#sameChoice) {
            if (!this.#choice) {
                this.#choice = this.#calculateChoice();
            }

            result = this.#choice;
        } else {
            result = this.#calculateChoice();
        }

        return result;
    }

    #calculateChoice(): number {
        const range: Range | undefined = this.#CHOICES.get(this.#currentCategory);
        let result: number = 0;
        if (range) {
            result = Random.randomFloatInRange(range);
        }

        return result;
    }
}
