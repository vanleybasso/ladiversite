const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Caminho para o arquivo de dados
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// Criar arquivos se não existirem
if (!fs.existsSync(path.dirname(ORDERS_FILE))) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}

// Rotas para pedidos
app.get('/orders', (req, res) => {
  try {
    const { userId } = req.query;
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    
    if (userId) {
      const userOrders = orders.filter(order => order.userId === userId);
      return res.json(userOrders);
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders', (req, res) => {
  try {
    const newOrder = req.body;
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    
    // Adiciona ID único e data ao pedido
    newOrder.id = generateId();
    newOrder.date = new Date().toISOString();
    
    orders.push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota para avaliações
app.post('/orders/:orderId/review', (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId, rating, comment, date } = req.body;
    
    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid review data' });
    }
    
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Verifica se o produto existe no pedido
    const productExists = orders[orderIndex].items.some(item => item.id === productId);
    if (!productExists) {
      return res.status(400).json({ error: 'Product not found in this order' });
    }
    
    // Inicializa o objeto de reviews se não existir
    if (!orders[orderIndex].reviews) {
      orders[orderIndex].reviews = {};
    }
    
    // Adiciona/atualiza a avaliação
    orders[orderIndex].reviews[productId] = {
      rating,
      comment: comment || '',
      date: date || new Date().toISOString()
    };
    
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rotas para produtos (opcional, para a página de produto)
app.get('/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Função auxiliar para gerar IDs
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});