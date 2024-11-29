/*
  inquirer-sortable-list
  https://github.com/JayCanuck/inquirer-sortable-list

  Copyright 2024 Jason Robitaille

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.


  Based on the inquirer-sortable-checkbox under MIT License
  https://github.com/th0r/inquirer-sortable-checkbox

  Copyright (c) 2024 Yuriy Grunin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/

import {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  usePagination,
  makeTheme,
  isUpKey,
  isDownKey,
  isEnterKey,
} from '@inquirer/core';
import chalk from 'chalk';
import figures from '@inquirer/figures';
import ansiEscapes from 'ansi-escapes';

type ReorderListTheme = {
  icon: { cursor: string };
  style: { highlight: (text: string) => string };
};

const defaultTheme: ReorderListTheme = {
  icon: { cursor: chalk.green(figures.pointer) }, // Pointer styled in green
  style: {
    highlight: chalk.bold, // Highlight active item with bold text
  },
};

type Config = {
  message: string;
  choices: string[];
  pageSize?: number;
  theme?: Partial<ReorderListTheme>;
};

function isEscapeKey(key: { name?: string }): boolean {
  return key.name === 'escape';
}

export default createPrompt(
  (config: Config, done: (value: Array<string>) => void) => {
    const { message, choices, pageSize = 7, theme: customTheme } = config;
    const theme = makeTheme<ReorderListTheme>({ ...defaultTheme, ...(customTheme || {}) });
    const prefix = usePrefix({ theme });

    const [items, setItems] = useState(choices);
    const [active, setActive] = useState(0);
    const originalOrder = [...choices]; // Store the original order for escape

    if (items.length === 0) {
      return `${prefix} ${message}\n(No items to display)`;
    }

    useKeypress((key) => {
      if (isEscapeKey(key)) {
        done(originalOrder); // Exit without changes
      } else if (isEnterKey(key)) {
        done(items); // Submit reordered list
      } else if (isUpKey(key) || isDownKey(key)) {
        const offset = isUpKey(key) ? -1 : 1;
        if (key.ctrl) {
          // Reorder the items with Ctrl + Arrow
          const newIndex = active + offset;
          if (newIndex >= 0 && newIndex < items.length) {
            const newItems = [...items];
            [newItems[active], newItems[newIndex]] = [
              newItems[newIndex],
              newItems[active],
            ];
            setItems(newItems);
            setActive(newIndex); // Update active position
          }
        } else {
          // Navigate the list
          setActive((active + offset + items.length) % items.length);
        }
      }
    });

    const page = usePagination({
      items,
      active,
      renderItem({ item, isActive }) {
        const cursor = isActive ? theme.icon.cursor : ' ';
        const color = isActive ? theme.style.highlight : (text: string) => text;

        return color(`${cursor} ${item}`);
      },
      pageSize,
      loop: true,
    });

    const helperMessage = `(Use arrow keys to navigate, ctrl+up/down to reorder, enter to confirm, escape to cancel)`;
    return `${prefix} ${message}\n${page}\n${helperMessage}${ansiEscapes.cursorHide}`;
  }
);
