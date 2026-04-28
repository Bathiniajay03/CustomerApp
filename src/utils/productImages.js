const PRODUCT_IMAGE_MAP = {
  'MILK-001': '/images/products/dairy-milk.svg',
  'BREAD-001': '/images/products/bakery-bread.svg',
  'EGGS-001': '/images/products/dairy-eggs.svg',
  'APPLE-001': '/images/products/fruits-apple.svg',
  'BANANA-001': '/images/products/fruits-apple.svg',
  'TOMATO-001': '/images/products/vegetables-tomato.svg',
  'POTATO-001': '/images/products/vegetables-tomato.svg',
  'ONION-001': '/images/products/vegetables-tomato.svg',
  'WATER-001': '/images/products/beverages-water.svg',
  'SODA-001': '/images/products/beverages-water.svg',
  'CHIPS-001': '/images/products/snacks-chips.svg',
  'SNACK-001': '/images/products/snacks-chips.svg',
  'SOAP-001': '/images/products/personal-care-soap.svg',
  'SHAMPOO-001': '/images/products/personal-care-soap.svg',
  'DETERGENT-001': '/images/products/household-detergent.svg',
  'GROC-MILK-01': '/images/products/dairy-milk.svg',
  'GROC-BREAD-01': '/images/products/bakery-bread.svg',
  'GROC-EGGS-01': '/images/products/dairy-eggs.svg',
  'GROC-APPLE-01': '/images/products/fruits-apple.svg',
  'GROC-BANANA-01': '/images/products/fruits-apple.svg',
  'GROC-TOMATO-01': '/images/products/vegetables-tomato.svg',
  'GROC-POTATO-01': '/images/products/vegetables-tomato.svg',
  'GROC-ONION-01': '/images/products/vegetables-tomato.svg',
  'GROC-WATER-01': '/images/products/beverages-water.svg',
  'GROC-CHIPS-01': '/images/products/snacks-chips.svg',
  'GROC-SHAMPOO-01': '/images/products/personal-care-soap.svg',
  'GROC-DETERGENT-01': '/images/products/household-detergent.svg',
};

const CATEGORY_IMAGE_MAP = {
  dairy: '/images/products/dairy-milk.svg',
  bakery: '/images/products/bakery-bread.svg',
  fruits: '/images/products/fruits-apple.svg',
  vegetables: '/images/products/vegetables-tomato.svg',
  beverages: '/images/products/beverages-water.svg',
  snacks: '/images/products/snacks-chips.svg',
  'personal care': '/images/products/personal-care-soap.svg',
  household: '/images/products/household-detergent.svg',
  electronics: '/images/products/electronics-gadget.svg',
  accessories: '/images/products/electronics-accessories.svg',
  audio: '/images/products/electronics-audio.svg',
  general: '/images/products/general-item.svg',
};

export const getProductImageUrl = (product) => {
  if (!product) return '/images/products/default.svg';

  if (product.imageUrl) {
    return product.imageUrl;
  }

  const byCode = PRODUCT_IMAGE_MAP[product.itemCode];
  if (byCode) {
    return byCode;
  }

  const categoryKey = (product.category || '').toLowerCase();
  return CATEGORY_IMAGE_MAP[categoryKey] || '/images/products/default.svg';
};
