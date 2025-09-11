document.addEventListener('DOMContentLoaded', () => {
    const shoeForm = document.getElementById('shoe-form');
    const shoeId = document.getElementById('shoe-id');
    const brandInput = document.getElementById('brand');
    const modelInput = document.getElementById('model');
    const sizeInput = document.getElementById('size');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const shoeList = document.getElementById('shoe-list');
    const submitButton = document.getElementById('submit-button');

    let shoes = JSON.parse(localStorage.getItem('shoes')) || [];

    // Función para renderizar los zapatos en la tabla
    const renderShoes = () => {
        shoeList.innerHTML = '';
        if (shoes.length === 0) {
            shoeList.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay zapatos en el inventario.</td></tr>';
            return;
        }

        shoes.forEach((shoe, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${shoe.brand}</td>
                <td>${shoe.model}</td>
                <td>${shoe.size}</td>
                <td>$${shoe.price.toFixed(2)}</td>
                <td>${shoe.stock}</td>
                <td>
                    <button class="edit-btn" onclick="editShoe(${index})">Editar</button>
                    <button class="delete-btn" onclick="deleteShoe(${index})">Eliminar</button>
                </td>
            `;
            shoeList.appendChild(row);
        });
    };

    // Función para guardar los zapatos en LocalStorage
    const saveShoes = () => {
        localStorage.setItem('shoes', JSON.stringify(shoes));
    };

    // Manejar el envío del formulario (Crear y Actualizar)
    shoeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = shoeId.value;
        const brand = brandInput.value;
        const model = modelInput.value;
        const size = parseFloat(sizeInput.value);
        const price = parseFloat(priceInput.value);
        const stock = parseInt(stockInput.value);

        if (id) {
            // Actualizar zapato existente
            const shoeIndex = parseInt(id);
            shoes[shoeIndex] = { brand, model, size, price, stock };
            submitButton.textContent = 'Agregar Zapato';
        } else {
            // Agregar nuevo zapato
            shoes.push({ brand, model, size, price, stock });
        }

        saveShoes();
        renderShoes();
        shoeForm.reset();
        shoeId.value = '';
    });

    // Función para editar un zapato
    window.editShoe = (index) => {
        const shoe = shoes[index];
        shoeId.value = index;
        brandInput.value = shoe.brand;
        modelInput.value = shoe.model;
        sizeInput.value = shoe.size;
        priceInput.value = shoe.price;
        stockInput.value = shoe.stock;
        submitButton.textContent = 'Actualizar Zapato';
        window.scrollTo(0, 0); // Desplaza la vista al formulario
    };

    // Función para eliminar un zapato
    window.deleteShoe = (index) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el zapato ${shoes[index].brand} ${shoes[index].model}?`)) {
            shoes.splice(index, 1);
            saveShoes();
            renderShoes();
        }
    };

    // Renderizar los zapatos al cargar la página
    renderShoes();
});