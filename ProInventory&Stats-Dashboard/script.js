const products = [
  {
    id: 17123456,
    name: 'Smart Watch Pro',
    price: 5000,
    category: 'Electronics',
    stock: 3,
    rating: 4.8,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    id: 17123499,
    name: 'Running Shoes',
    price: 2500,
    category: 'Fitness',
    stock: 45,
    rating: 4.2,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  },
  {
    id: 17123510,
    name: 'Noise Cancel Headphones',
    price: 8000,
    category: 'Electronics',
    stock: 12,
    rating: 4.6,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    id: 17123522,
    name: 'Wireless Mouse',
    price: 1200,
    category: 'Electronics',
    stock: 2,
    rating: 4.5,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  },
  {
    id: 17123533,
    name: 'Mechanical Keyboard',
    price: 4500,
    category: 'Electronics',
    stock: 15,
    rating: 4.7,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
  },
  {
    id: 17123544,
    name: 'Cotton T-Shirt',
    price: 999,
    category: 'Fashion',
    stock: 60,
    rating: 4.0,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  },
  {
    id: 17123555,
    name: 'Leather Jacket',
    price: 5500,
    category: 'Fashion',
    stock: 4,
    rating: 4.9,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1551028711-535587e67671?w=500',
  },
  {
    id: 17123566,
    name: 'Yoga Mat',
    price: 1500,
    category: 'Fitness',
    stock: 25,
    rating: 4.3,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1592432678899-912f29bc9086?w=500',
  },
  {
    id: 17123577,
    name: 'Dumbbells (5kg Pair)',
    price: 2200,
    category: 'Fitness',
    stock: 8,
    rating: 4.5,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa200c00?w=500',
  },
  {
    id: 17123588,
    name: 'Smart LED Bulb',
    price: 850,
    category: 'Electronics',
    stock: 100,
    rating: 4.1,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500',
  },
  {
    id: 17123599,
    name: 'Polarized Sunglasses',
    price: 1800,
    category: 'Fashion',
    stock: 1,
    rating: 4.4,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
  },
  {
    id: 17123610,
    name: 'Slim Fit Jeans',
    price: 2800,
    category: 'Fashion',
    stock: 35,
    rating: 4.2,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
  },
  {
    id: 17123621,
    name: 'Protein Shaker',
    price: 600,
    category: 'Fitness',
    stock: 50,
    rating: 3.9,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1593091417541-49c482685670?w=500',
  },
  {
    id: 17123632,
    name: 'Gaming Monitor',
    price: 15000,
    category: 'Electronics',
    stock: 6,
    rating: 4.8,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
  },
];

const app = {
  itemsData: [...products],

  // 1. Central State (UX ka dimaag)
  state: {
    category: 'all',
    sort: 'default',
    search: '',
  },

  // Target Elements
  productsTable: document.querySelector('.admin-table'),
  tBody: document.querySelector('#inventoryBody'),
  statusMsg: document.querySelector('#status-Msg'),
  filterCategory: document.querySelector('#filterCategory'),
  searchInput: document.querySelector('#pSearch'),
  totalValue: document.querySelector('#totalValue'),
  lowStockCount: document.querySelector('#lowStockCount'),
  topRatedName: document.querySelector('#topRatedName'),
  productsSorting: document.querySelector('#pSort'),
  wipeDatabase: document.querySelector('#clearAll'),
  restoreDatabase: document.querySelector('#undoDatabase'),

  init: function () {
    // Listeners
    this.filterCategory.addEventListener('change', (e) => {
      this.state.category = e.target.value;
      this.applyAllFilter();
    });

    this.searchInput.addEventListener('input', (e) => {
      this.state.search = e.target.value.toLowerCase().trim();
      this.applyAllFilter();
    });

    this.productsSorting.addEventListener('change', (e) => {
      this.state.sort = e.target.value;
      this.applyAllFilter();
    });

    // clear Database
    this.wipeDatabase.addEventListener('click', () => {
      this.databaseRemove();
    });
    this.restoreDatabase.addEventListener('click', () => {
      this.databaseRestore();
    });

    // Initial Loading Simulation
    this.productsTable.style.display = 'none';
    this.statusMsg.style.color = 'purple';
    this.statusMsg.innerHTML =
      '🔃 Fetching data from server, please wait 3s...';

    setTimeout(() => {
      if (this.itemsData && this.itemsData.length > 0) {
        this.productsTable.style.display = 'table';
        this.applyAllFilter();
        this.statusMsg.style.color = 'green';
        this.statusMsg.innerHTML = `✅ ${this.itemsData.length} Products loaded successfully.`;
        setTimeout(() => {
          this.statusMsg.innerHTML = '';
        }, 3000);
      } else {
        this.productsTable.style.display = 'none';
        this.statusMsg.style.color = 'red';
        this.statusMsg.innerHTML = '⚠️ No products available at this moment!';
      }
    }, 1500);
  },

  render: function (data) {
    this.tBody.innerHTML = data
      .map((p) => {
        const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
        return `
          <tr>
              <td>
                  <div class="prod-info">
                      <img src="${p.image}" alt="">
                      <span><b>${p.name}</b><br><small>ID: ${
          p.id
        }</small></span>
                  </div>
              </td>
              <td>${p.category}</td>
              <td>₹${p.price.toLocaleString()}</td>
              <td>${p.discount}%</td>
              <td><b class="final-price">₹${finalPrice.toLocaleString()}</b></td>
              <td><span class="status-badge ${
                p.stock < 5 ? 'stock-low' : 'stock-in'
              }">
                ${
                  p.stock < 5 ? p.stock + ' (Refill!)' : p.stock + ' Units'
                }</span>
              </td>
              <td>⭐ ${p.rating}</td>
              <td>
                  <div class="btn-group">
                      <button class="icon-btn btn-edit" onclick="app.editProduct(${
                        p.id
                      })">⚙️</button>
                      <button class="icon-btn btn-del" onclick="app.deleteProduct(${
                        p.id
                      })">🗑️</button>
                  </div>
              </td>
          </tr>`;
      })
      .join('');
  },

  // 2. Master Filter (Combined Logic)
  applyAllFilter: function () {
    let filtered = [...this.itemsData];

    // A. Category filtering
    if (this.state.category !== 'all') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === this.state.category.toLowerCase()
      );
    }

    // B. Search filtering
    if (this.state.search !== '') {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(this.state.search) ||
          p.id.toString().includes(this.state.search)
      );
    }

    // C. Sorting logic (Switch Case)
    switch (this.state.sort) {
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'stockLow':
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case 'stockHigh':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    this.render(filtered);
    this.updateStats(filtered);
    this.handleTableVisibility(filtered);
  },

  updateStats: function (data) {
    if (data.length === 0) {
      this.totalValue.innerHTML = '₹0';
      this.lowStockCount.innerHTML = '0';
      this.topRatedName.innerHTML = 'None';
      [this.totalValue, this.lowStockCount, this.topRatedName].forEach(
        (el) => (el.style.color = 'red')
      );
      return;
    }

    [this.totalValue, this.lowStockCount, this.topRatedName].forEach(
      (el) => (el.style.color = '')
    );

    // Stats calculation based on CURRENT filtered data
    const total = data.reduce((acc, p) => acc + p.price * p.stock, 0);
    const lowItems = data.filter((p) => p.stock < 5).length;
    const topItem = [...data].sort((a, b) => b.rating - a.rating)[0];

    this.totalValue.innerHTML = `₹${total.toLocaleString()}`;
    this.totalValue.style.color = 'purple';
    this.lowStockCount.innerHTML = lowItems;
    this.topRatedName.innerHTML = topItem.name;
    this.topRatedName.style.color = 'blue';
    if (lowItems > 0) this.lowStockCount.style.color = 'orange';
  },
  // handle status Msgs
  handleTableVisibility: function (data) {
    if (data.length === 0) {
      // Case 1: No data found
      this.productsTable.style.display = 'none';
      this.statusMsg.style.color = 'red';
      this.statusMsg.innerHTML = '❌ No matching results found';
    } else {
      // Case 2: Data found
      this.productsTable.style.display = 'table';
      if (this.state.search !== '' || this.state.category !== 'all') {
        this.statusMsg.style.color = 'purple';
        this.statusMsg.innerHTML = `✅ ${data.length} items found matching your criteria.`;
        setTimeout(() => {
          this.statusMsg.innerHTML = '';
        }, 2000);
      } else {
        // Default load par message clear rakho
        if (this.statusMsg.style.color === 'red') this.statusMsg.innerHTML = '';
      }
    }
  },
  // delete prodocts
  deleteProduct: function (id) {
    const confirmed = confirm('Do you really want to remove this product?');
    if (confirmed) {
      this.itemsData = this.itemsData.filter((item) => item.id !== id);

      this.applyAllFilter();
      // 4. Success message
      this.statusMsg.style.color = 'orange';
      this.statusMsg.innerHTML = '🗑️ Item deleted successfully!';

      setTimeout(() => (this.statusMsg.innerHTML = ''), 2000);
    }
  },

  // remove Database
  databaseRemove: function () {
    const userConfirmation = confirm(
      '⚠️ WARNING: Are you sure you want to permanently wipe the entire database? This action cannot be undone!'
    );
    if (userConfirmation) {
      this.itemsData.length = 0;

      // filter reset
      this.state.category = 'all';
      this.state.sort = 'default';
      this.state.search = '';

      // Input inputs reset
      this.filterCategory.value = 'all';
      this.productsSorting.value = 'default';
      this.searchInput.value = '';
      this.applyAllFilter();
      // 4. Feedback (Red color for alert)
      this.statusMsg.style.color = 'red';
      this.statusMsg.innerHTML = '🚫 Database wiped out successfully.';

      setTimeout(() => {
        this.statusMsg.innerHTML = '';
      }, 3000);
    }
  },

  // restore Database
  // restore Database
  databaseRestore: function () {
    if (confirm('Are you sure you want to restore the default database?')) {
      // 1. Fresh copy
      this.itemsData = [...products];

      this.state.category = 'all';
      this.state.sort = 'default';
      this.state.search = '';

      this.filterCategory.value = 'all';
      this.productsSorting.value = 'default';
      this.searchInput.value = '';

      // 4. Sync UI
      this.applyAllFilter();

      // 5. Success Message
      this.statusMsg.style.color = 'green';
      this.statusMsg.innerHTML =
        '🔄 Database restored to default successfully!';

      setTimeout(() => (this.statusMsg.innerHTML = ''), 3000);
    }
  },
};

app.init();
