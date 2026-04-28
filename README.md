# Customer Shopping App - Quick Commerce Frontend

React-based customer shopping application for Quick Commerce (Zepto-style) system.

## Features

- 🛍️ Browse products with real-time stock availability
- 🔍 Search and filter products
- 🛒 Shopping cart management
- 💳 Quick checkout flow
- 📦 Order tracking with delivery status
- 📱 Mobile-responsive design

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- Backend API running at `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Configuration

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Usage

The app runs at `http://localhost:3000`

1. **Browse Products** - View available products from home page
2. **Add to Cart** - Click "Add to Cart" on any product
3. **View Cart** - Click cart icon in navigation
4. **Checkout** - Fill delivery info and place order
5. **Track Orders** - View order history and status

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.jsx  # Product display card
│   └── ProductList.jsx  # Product grid
├── hooks/              # Custom React hooks
│   └── useCart.js      # Cart state management
├── pages/              # Page components
│   ├── Home.jsx        # Product listing
│   ├── CartPage.jsx    # Shopping cart
│   ├── CheckoutPage.jsx # Checkout flow
│   └── OrdersPage.jsx  # Order history
├── services/           # API integration
│   └── api.js          # Axios API client
├── App.js              # Main app component
└── App.css             # Global styles
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Launches the test runner.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
Ejects from Create React App (irreversible!).

## Demo Customer

For testing, use customer ID: `1`

This is hardcoded in `App.js`. In production, this would come from authentication.

## API Integration

All API calls are made through `src/services/api.js`:

```javascript
import { productsApi, cartApi, ordersApi } from './services/api';

// Get products
const products = await productsApi.getAll();

// Add to cart
await cartApi.add(customerId, productId, quantity);

// Place order
await ordersApi.placeOrder(customerId, items);
```

## State Management

Cart state is managed via custom hook `useCart`:

```javascript
import { useCart } from '../hooks/useCart';

const { 
  cartItems, 
  loading, 
  cartTotal, 
  addToCart, 
  removeFromCart,
  updateQuantity 
} = useCart(customerId);
```

## Styling

The app uses plain CSS with:
- Modern flexbox/grid layouts
- Responsive design
- Clean, minimal aesthetic
- Color-coded status badges

## Key Features

### Product Browsing
- Grid layout with auto-responsiveness
- Stock availability badges
- Product details on hover
- Quick add-to-cart

### Shopping Cart
- Real-time updates
- Quantity controls
- Total calculation
- Persistent storage

### Checkout
- Simple form validation
- Order summary
- One-click order placement
- Error handling

### Order Tracking
- Complete order history
- Status visualization
- Delivery timeline
- Itemized breakdown

## Troubleshooting

**Can't connect to API?**
- Check backend is running at port 5000
- Verify `REACT_APP_API_URL` in `.env`

**Cart not updating?**
- Ensure customer ID exists in database
- Check browser console for errors

**Products not showing?**
- Verify backend has products in inventory
- Check network tab for API errors

## Production Build

```bash
# Build optimized production bundle
npm run build

# Serve the build locally (optional)
npx serve -s build
```

## Deployment

The app can be deployed to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting

See `VERCEL_DEPLOYMENT_GUIDE.md` in main project for deployment instructions.

## Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2"
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

---

**Built with ❤️ for Quick Commerce**
