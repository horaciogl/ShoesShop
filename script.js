document.addEventListener('DOMContentLoaded', () => {
    // Exportar a Excel (XLSX) e importar desde Excel/XLSX
    function ensureSheetJS(callback) {
        if (window.XLSX) {
            callback();
        } else {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
    }

    const exportXlsxBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    // ...existing CRUD code...
    // Exportar a Excel (XLSX)
    if (exportXlsxBtn) {
        exportXlsxBtn.addEventListener('click', () => {
            if (!shoes.length) {
                alert('No hay datos para exportar.');
                return;
            }
            ensureSheetJS(() => {
                const data = [
                    ['ID','Marca','Modelo','Talla','Precio','Stock','Imagen'],
                    ...shoes.map(shoe => [
                        shoe.uid || '',
                        shoe.brand,
                        shoe.model,
                        shoe.size,
                        shoe.price,
                        shoe.stock,
                        shoe.image || ''
                    ])
                ];
                const ws = XLSX.utils.aoa_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Zapatos');
                XLSX.writeFile(wb, 'zapatos.xlsx');
            });
        });
    }

    // Importar desde Excel/XLSX
    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => {
            importFile.value = '';
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            ensureSheetJS(() => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    let data = event.target.result;
                    let workbook;
                    if (file.name.endsWith('.xlsx')) {
                        workbook = XLSX.read(data, {type: 'binary', codepage: 65001});
                    } else {
                        workbook = XLSX.read(data, {type: 'binary'});
                    }
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(sheet, {header:1, defval: ''});
                    // Expect header: ID, Marca, Modelo, Talla, Precio, Stock, Imagen
                    if (json.length < 2) {
                        alert('El archivo no contiene datos válidos.');
                        return;
                    }
                    const header = json[0].map(h => h.toLowerCase().trim());
                    const idx = {
                        uid: header.indexOf('id'),
                        brand: header.indexOf('marca'),
                        model: header.indexOf('modelo'),
                        size: header.indexOf('talla'),
                        price: header.indexOf('precio'),
                        stock: header.indexOf('stock'),
                        image: header.indexOf('imagen')
                    };
                    if (Object.values(idx).some(i => i === -1)) {
                        alert('El archivo debe tener las columnas: ID, Marca, Modelo, Talla, Precio, Stock, Imagen');
                        return;
                    }
                    let added = 0;
                    let updated = 0;
                    for (let i = 1; i < json.length; i++) {
                        const row = json[i];
                        if (!row[idx.uid] || !row[idx.brand] || !row[idx.model]) continue;
                        const uid = String(row[idx.uid]).trim();
                        const shoe = {
                            uid,
                            brand: String(row[idx.brand]),
                            model: String(row[idx.model]),
                            size: parseFloat(row[idx.size]) || '',
                            price: parseFloat(row[idx.price]) || 0,
                            stock: parseInt(row[idx.stock]) || 0,
                            image: row[idx.image] || ''
                        };
                        const existingIndex = shoes.findIndex(s => s.uid === uid);
                        if (existingIndex !== -1) {
                            shoes[existingIndex] = shoe;
                            updated++;
                        } else {
                            shoes.push(shoe);
                            added++;
                        }
                    }
                    if (added > 0 || updated > 0) {
                        saveShoes();
                        renderShoes();
                        alert(`Se importaron ${added} y actualizaron ${updated} zapatos.`);
                    } else {
                        alert('No se importaron ni actualizaron datos nuevos.');
                    }
                };
                reader.readAsBinaryString(file);
            });
        });
    }
    const shoeForm = document.getElementById('shoe-form');
    const shoeId = document.getElementById('shoe-id'); // hidden field for edit index
    const shoeUid = document.getElementById('shoe-uid'); // visible unique ID field
    const brandInput = document.getElementById('brand');
    const modelInput = document.getElementById('model');
    const sizeInput = document.getElementById('size');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const imageInput = document.getElementById('image');
    const shoeList = document.getElementById('shoe-list');
    const submitButton = document.getElementById('submit-button');

    let shoes = JSON.parse(localStorage.getItem('shoes')) || [];

    // Función para renderizar los zapatos en la tabla
    const renderShoes = () => {
        shoeList.innerHTML = '';
        if (shoes.length === 0) {
            shoeList.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay zapatos en el inventario.</td></tr>';
            return;
        }
        shoes.forEach((shoe, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${shoe.uid || ''}</td>
                <td>${shoe.brand}</td>
                <td>${shoe.model}</td>
                <td>${shoe.size}</td>
                <td>$${shoe.price.toFixed(2)}</td>
                <td>${shoe.stock}</td>
                <td>${shoe.image ? `<img src="${shoe.image}" alt="Imagen" style="max-width:60px;max-height:60px;object-fit:cover;">` : ''}</td>
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
        const uid = shoeUid.value.trim();
        const brand = brandInput.value;
        const model = modelInput.value;
        const size = parseFloat(sizeInput.value);
        const price = parseFloat(priceInput.value);
        const stock = parseInt(stockInput.value);

        if (!uid) {
            alert('El campo ID es obligatorio.');
            return;
        }
        // Check for duplicate UID (except when updating the same shoe)
        const duplicate = shoes.findIndex((shoe, idx) => shoe.uid === uid && String(idx) !== id);
        if (duplicate !== -1) {
            alert('Ya existe un zapato con ese ID.');
            return;
        }

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageBase64 = event.target.result;
                saveShoeObject(id, uid, brand, model, size, price, stock, imageBase64);
            };
            reader.readAsDataURL(file);
        } else {
            let imageBase64 = '';
            if (id && shoes[id] && shoes[id].image) {
                imageBase64 = shoes[id].image;
            }
            saveShoeObject(id, uid, brand, model, size, price, stock, imageBase64);
        }
    });

    function saveShoeObject(id, uid, brand, model, size, price, stock, imageBase64) {
        if (id) {
            // Actualizar zapato existente
            const shoeIndex = parseInt(id);
            shoes[shoeIndex] = { uid, brand, model, size, price, stock, image: imageBase64 };
            submitButton.textContent = 'Agregar Zapato';
        } else {
            // Agregar nuevo zapato
            shoes.push({ uid, brand, model, size, price, stock, image: imageBase64 });
        }
        saveShoes();
        renderShoes();
        shoeForm.reset();
        shoeId.value = '';
        shoeUid.value = '';
    }

    // Función para editar un zapato
    window.editShoe = (index) => {
        const shoe = shoes[index];
        shoeId.value = index;
        shoeUid.value = shoe.uid || '';
        brandInput.value = shoe.brand;
        modelInput.value = shoe.model;
        sizeInput.value = shoe.size;
        priceInput.value = shoe.price;
        stockInput.value = shoe.stock;
        imageInput.value = '';
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