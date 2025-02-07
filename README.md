
# Design Pattern Configurator

**Design Pattern Configurator** is a web application that helps developers implement and customize design patterns. It allows easy code generation, pattern modification through a graphical interface, and downloading of customized implementations.  

## 📑 Table of Contents  

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [🎥 Application Preview](#-application-preview)  
  - [Selecting a Pattern & Modifying Parameters](#1️⃣-selecting-a-pattern--modifying-parameters)  
  - [Direct Code Editing](#2️⃣-direct-code-editing)  
  - [Available Patterns](#3️⃣-available-patterns)  
  - [Downloading the Final Code](#4️⃣-downloading-the-final-code)  
- [Flexible & Extensible Architecture](#flexible--extensible-architecture)  
  - [JSON-Based Configuration Format](#json-based-configuration-format)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
- [Usage](#usage)  
- [Testing](#testing)  

---

## Features  

- **Interactive Pattern Customization** – Modify design pattern code dynamically using a code editor and configurable parameters.  
- **Support for Multiple Design Patterns** – Includes creational, structural, behavioral, and other patterns.  
- **Multi-Language Support** – Generate design pattern implementations in **Java, C++, and TypeScript**.  
- **Automatic Code Generation** – Injects parameters directly into source code templates.  
- **Read-Only Editing Mode** – Enables safe code browsing without accidental modifications.  
- **Pattern File System** – Download customized pattern structures as a ZIP archive.  

## Technologies Used  

- **Java** – The primary programming language for pattern implementation.  
- **React.js** – Provides an interactive user interface.  
- **TypeScript** – Enhances type safety and code quality on the frontend.  
- **Monaco Editor** – A powerful code editor used in Visual Studio Code.  
- **Material UI** – Modern UI components for a clean design.  
- **Redux Toolkit** – Efficient state management for the application.  
- **JSON** – Used for pattern configuration and parameter management.  

## 🎥 Application Preview  

Below are demonstrations of the key functionalities of the **Design Pattern Configurator**:  

### 1️⃣ Selecting a Pattern & Modifying Parameters  
Easily choose a design pattern and adjust its parameters dynamically without modifying the source code directly.  
![1  Wybór wzorca i zmiana parametrów](https://github.com/user-attachments/assets/47ace4a7-978c-41f6-a4b0-dbdc912b2d9f)  

### 2️⃣ Direct Code Editing  
Switch to **direct editing mode** to manually adjust the generated code in the built-in Monaco editor.  
![2  Bezpośrednia modyfikacja kodu wzorca](https://github.com/user-attachments/assets/f1c54392-6dab-4b85-8fc5-f3e8d4ecc0ab)  

### 3️⃣ Available Patterns  
Browse a structured list of **creational, structural, and behavioral** design patterns supported by the tool.  
![3  Dostępne wzorce](https://github.com/user-attachments/assets/7bd4c94f-e729-4f92-b4ff-97537ffa20cf)  

### 4️⃣ Downloading the Final Code  
Once the pattern is configured, **download** the generated code as a ZIP file for easy integration into your project.  
![4  Pobranie rezultatów prac](https://github.com/user-attachments/assets/efe68d14-2ad8-4f98-aa8a-304bcdc98491)  

## Flexible & Extensible Architecture  

The **Design Pattern Configurator** is designed with flexibility and extensibility in mind. It provides a high level of abstraction, enabling developers not only to use classic design patterns but also to extend them according to their specific needs.  

- **Support for Various Patterns** – While the tool includes well-known design patterns, its architecture allows for the addition of custom patterns, making it highly adaptable.  
- **Multi-Language Pattern Implementations** – The system supports **Java, C++, and TypeScript**, allowing developers to generate patterns across different programming languages.  
- **Configurable and Expandable** – The tool leverages a **custom JSON-based configuration system**, enabling easy modifications to pattern structures, class names, and implementation details.  
- **Separation of Concerns** – The architecture decouples pattern logic from implementation specifics, ensuring reusability across various projects and languages.  

### JSON-Based Configuration Format  

To achieve this abstraction, a dedicated **configuration format** has been designed using JSON. This format defines how methods are generated dynamically for different programming languages.  

#### Example JSON Configuration:  
```json
{
    "generatePatterns": [
        {
            "language": "java",
            "defaultAccessType": "public",
            "accessTypes": [
                "public",
                "private",
                "protected"
            ],
            "returnTypes": [
                {
                    "returnType": "void",
                    "shouldReturn": ""
                },
                {
                    "returnType": "int",
                    "shouldReturn": "return 0;"
                },
                {
                    "returnType": "long",
                    "shouldReturn": "return 0;"
                }
            ],
            "bodyTemplate": "\t@Override\n\t$ACCESS_TYPE$ $RETURN_TYPE$ $NAME$($PARAMS$){\n\t\t$RETURN_TYPE_VALUE$\n\t}"
        }
    ]
}
```  

#### Configuration Structure:  

- **generatePatterns** – An array defining supported method generation configurations for different programming languages.  
- **language** – The programming language for which method body generation is supported.  
- **defaultAccessType** – The default access modifier applied to generated methods.  
- **accessTypes** – A list of possible access modifiers that can be used in method headers.  
- **returnTypes** – An array defining supported return types for generated methods:  
  - **returnType** – The name of the return type.  
  - **shouldReturn** – The default return value for a given return type.  
- **bodyTemplate** – A template defining how method bodies are generated, with placeholders that are dynamically replaced during pattern generation:  
  - *$ACCESS_TYPE$* – The access modifier of the method.  
  - *$RETURN_TYPE$* – The return type of the method.  
  - *$NAME$* – The method name.  
  - *$PARAMS$* – The method parameters.  
  - *$RETURN_TYPE_VALUE$* – The return value based on the defined return type.  

By utilizing this configuration format, the tool provides a **highly modular and extensible** approach to design pattern generation. Developers can easily add support for new languages, define new method structures, and modify existing patterns without directly altering the source code.  

## Getting Started  

### Prerequisites  

- **Node.js** 16+  
- **npm** 9.7+  
- **Internet connection**  

### Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/BlackRaven18/design-pattern-configurator.git  
   cd design-pattern-configurator 
   ```  

2. **Install dependencies**  
   ```bash
   npm install  
   ```  

3. **Run the frontend application**  
   ```bash
   npm start  
   ```  
   The application will be available at `http://localhost:3000`.  

## Usage  

After launching the application, users can:  
4. Select a design pattern from the available list.  
5. Customize class names, methods, and other parameters through the UI.  
6. Modify the generated code directly in the Monaco editor.  
7. Download the final pattern implementation in a ZIP archive.  

## Testing  

The application includes unit tests written with **Jest** and **React Testing Library**. To run the tests:  
```bash
npm run test -- --coverage --watchAll  
```
