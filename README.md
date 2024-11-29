# inquirer-sortable-list [![NPM](https://img.shields.io/npm/v/inquirer-sortable-list.svg?logo=npm)](https://www.npmjs.com/package/inquirer-sortable-list)
> A custom prompt for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) which displays a sortable list

This prompt supports navigation using arrow keys and reordering with `Ctrl` + `Up`/`Down`. `Enter` submits the changes or `Escape` to abort and return the original unchanged array.

Inspired by [inquirer-sortable-checkbox](https://github.com/th0r/inquirer-sortable-checkbox).

### Installation
Install the package using npm or yarn:

```bash
npm install inquirer-sortable-list
```

or

```bash
yarn add inquirer-sortable-list
```

### Usage

Use the list prompt in your project by importing and configuring it:

```javascript
import sortablePrompt from 'inquirer-sortable-list';

const choices = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

sortablePrompt(
  {
    message: 'Reorder the items:',
    choices,
  },
  (result) => {
    console.log('Final order:', result);
  }
);
```

Or using `await`:

```javascript
import sortablePrompt from 'inquirer-sortable-list';

const choices = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

const result = await sortablePrompt({
  message: 'Reorder the items:',
  choices,
});

console.log('Final order:', result);
```

### API Reference

The list prompt accepts a configuration object with the following properties:

| Parameter   | Type                | Required | Description                                                                 |
|-------------|---------------------|----------|-----------------------------------------------------------------------------|
| `message`   | `string`            | Yes      | The message to display above the list.                                      |
| `choices`   | `string[]`          | Yes      | An array of strings representing the items in the list.                     |
| `pageSize`  | `number`            | No       | The maximum number of items to display at a time (default: `7`).            |
| `theme`     | `Partial<Theme>`    | No       | An optional theme object to customize the appearance of the prompt styles.  |

The `theme` object allows customizing the appearance of the pointer and highlighted items.

| Property           | Type                          | Description                                                           |
|--------------------|-------------------------------|-----------------------------------------------------------------------|
| `icon.cursor`      | `string`                      | The string used for the cursor/pointer (default: `❯`).                |
| `style.highlight`  | `(text: string) => string`    | A function to style the active (highlighted) item (default: bold ).   |

### Example Output
Before Reordering:

```
? Reorder the items:
  ❯ Option 1
    Option 2
    Option 3
    Option 4
(Use arrow keys to navigate, ctrl+up/down to reorder, enter to confirm, escape to cancel)
```

After Reordering (`Ctrl + Down` on "Option 1"):
```
? Reorder the items:
    Option 2
  ❯ Option 1
    Option 3
    Option 4
```

### License Information

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
