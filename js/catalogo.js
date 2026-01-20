document.addEventListener('DOMContentLoaded', () => {
    let products = [];
    const catalogGrid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');
    const modal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');

    // Fetch Products
    fetch('data/prodotti.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));

    // Render Products
    function renderProducts(productsToRender) {
        catalogGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            catalogGrid.innerHTML = '<p class="no-results">Nessun prodotto trovato.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card reveal active'; // Reveal active for dynamic content
            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.foto}" alt="${product.nome}">
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.marca}</div>
                    <h3>${product.nome}</h3>
                    <p class="price">${product.prezzo}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(product));
            catalogGrid.appendChild(card);
        });
    }

    // Filtering logic
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedBrand = brandFilter.value;

        const filtered = products.filter(product => {
            const matchesSearch = product.nome.toLowerCase().includes(searchTerm) ||
                                 product.descrizione.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;
            const matchesBrand = selectedBrand === 'all' || product.marca === selectedBrand;

            return matchesSearch && matchesCategory && matchesBrand;
        });

        renderProducts(filtered);
    }

    // Event Listeners for filters
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    brandFilter.addEventListener('change', filterProducts);

    // Modal logic
    function openModal(product) {
        document.getElementById('modal-img').src = product.foto;
        document.getElementById('modal-name').textContent = product.nome;
        document.getElementById('modal-brand').textContent = product.marca;
        document.getElementById('modal-price').textContent = product.prezzo;
        document.getElementById('modal-description').textContent = product.descrizione;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Disable scroll
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
