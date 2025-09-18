
# Tienda de Zapatos - CRUD

## Project Title
Tienda de Zapatos - CRUD

## Description
This is a simple web application for managing a shoe store's inventory. Users can add, edit, and delete shoes, with all operations performed in the browser. The app is designed for demonstration and educational purposes, using only HTML, CSS, and JavaScript.

## Overview
This project is a simple web-based inventory management system for a shoe store. It allows users to perform CRUD (Create, Read, Update, Delete) operations on a list of shoes, managing essential details such as brand, model, size, price, and stock. The application is built using HTML, CSS, and JavaScript, and is fully client-side.

## Features
- Add new shoes to the inventory with details: brand, model, size, price, stock, and image.
- Edit existing shoe entries directly from the inventory table.
- Delete shoes from the inventory.
- Export the inventory to a CSV/Excel file.
- Import new shoes from a CSV or Excel file (columns: Marca, Modelo, Talla, Precio, Stock, Imagen).
- Responsive and user-friendly interface.
- Real-time updates to the inventory table without page reloads.

## Requirements
- A modern web browser (Chrome, Firefox, Edge, Safari, etc.)
- No server or backend required; all data is managed in the browser's memory.

## Setup Instructions
1. Download or clone this repository to your local machine.
2. Open `index.html` in your preferred web browser.
3. No installation or build steps are required.

## Constraints
- Data is not persistent; refreshing the page will reset the inventory.
- No authentication or user management is implemented.
- Only supports basic inventory fields as defined in the form.
- Application is in Spanish.

## Dependencies
- [style.css](style.css): Custom CSS for layout and styling.
- [script.js](script.js): JavaScript for handling CRUD operations and DOM manipulation.
- No external libraries or frameworks are used.

## Usage
1. Fill in the shoe details in the form and click "Agregar Zapato" to add a new shoe.
2. Use the "Editar" and "Eliminar" buttons in the table to update or remove shoes.
3. To export the inventory, click the "Exportar a CSV" button. This will download a CSV file with all current data.
4. To import new shoes, click the "Importar desde Excel/CSV" button and select a file with the columns: Marca, Modelo, Talla, Precio, Stock, Imagen. Imported shoes will be added to the inventory.
5. All changes are reflected instantly in the table.
6. Note: Data will be lost when the page is refreshed.

## Summary
This project provides a straightforward, client-side CRUD application for managing a shoe store's inventory. It is ideal for learning or demonstration purposes, showcasing how to build interactive web applications using only HTML, CSS, and JavaScript.

## Contributor Guidelines
Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss your ideas.

## License
This project is licensed under the MIT License.