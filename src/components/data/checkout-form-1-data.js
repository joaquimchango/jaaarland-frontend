/**
 * Each block ships its own copy: registry install targets are globally unique, so a data file
 * cannot be shared between two blocks even when the contents match.
 */
export const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' }
]

export const countryLabels = Object.fromEntries(countryOptions.map(country => [country.value, country.label]))

export const initialCheckoutForm1Data = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: '',
  saveInfo: false,
  sameAsBilling: true,
  newsletter: false,
  promoCode: '',
}

export const orderSummary = {
  items: [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      variant: 'Midnight Black',
      price: 299.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/premium-wireless-headphones.600w.7d1414.avif',
    },
    {
      id: 2,
      name: 'Leather Laptop Sleeve',
      variant: 'Brown, 13-inch',
      price: 89.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/leather-laptop-sleeve.800w.86ef12.avif',
    },
  ],
  shipping: 15.99,
  tax: 27.54,
  discount: 0,
  promoDiscount: 0,
}