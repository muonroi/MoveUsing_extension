# Muonroi Extension

Muonroi is a Visual Studio Code extension that automatically moves `using` statements to a `globalUsing.cs` file. This helps you manage and reuse `using` directives across your entire C# project more easily.

## Features

- Automatically find and move `using` statements from the current `.cs` file to `globalUsing.cs`.
- Create a new `globalUsing.cs` file if it does not already exist.
- Notify you upon successful relocation.

## How to use

![](https://github.com/muonroi/MoveUsing_extension/blob/master/images/demo.gif)

## Requirements

- Visual Studio Code version 1.92.0 or later.
- A valid C# project structure with a `Properties` directory.

## Extension Settings

The extension does not require any special configuration. You can use the command `Move Usings to globalUsing.cs` from the Command Palette.

## Known Issues

There are currently no known issues.

## Release Notes

### 0.0.1

- Initial release with the functionality to move `using` statements to `globalUsing.cs`.

---

## Extension Guidelines

Make sure you have reviewed the extension development guidelines and adhere to best practices.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

---

**Enjoy coding with Muonroi!**