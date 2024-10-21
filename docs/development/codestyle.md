# Code Style

## Variables

_A variable name should be **CamelCase**._

```js
const ThisVariable = "smile"; // IsOkay(): true
const Variable = "i guess!"; // IsOkay(): true
const variableHappy = "NO!"; // IsOkay(): false
const ISSMILING = true; // IsOkay(): false
const GAME_POINTS = 2591; // IsOkay(): false
```

## Functions

_Function names need to be **CamelCase**._

```js
function sum(a, b) {
  const result = a + b;
  return result;
} // IsOkay(): true

function CheckEmoji(name) {
  const emojis = new Emojis({ useApp: true });
  if (!emojis[name]) return false;
  return emojis[name];
} // IsOkay(): true
```
