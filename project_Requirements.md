# Jaaarland

| Title | Status |
| --- | --- |
| Cycle 1 - Create user models and  auth routes | Done |
| Cycle 1 server - Install backend dependencies | Done |
| Cycle 1 server - Create db and connect mongoose to MongoDb | Done |
| Cycle 1 - Set up protected routes and update read me | Done |
| Cycle 1 Create jwt middleware | Done |
| Cycle 1 - create order models and route | Done |
| Cycle 1 -Create en variables | Done |
| Cycle i - Create product models and routes | Done |
| Cycle 1 - Deploy server | Done |
| Cycle 2 - create vite app with dependencies | Done |
| Cy 3  INtegrate Shadcn UI and shadcnStore | Done |
| CY 2- implement search and filtering | Backlog |
| CY 2 - Create orders history /using protected paths | Backlog |
| CY 2  - deploy frontend | Backlog |
| CY 3 Create presentation | Backlog |
| CY 3 Create readme files | Backlog |
| CY 2 Create Axios api client | Test |
| Cycle 2 - install axios and main routes react.router | Test |
| Cycle 2 Create the auth context and context provider and protected routes | Test |
| CY 2 Create main page + page components | In Progress |
| CY 2 - Create product catalogue and product detail | In Progress |
| CY 2- create checkout page with form | In Progress |
| CY 2 - implement shopping cart | In Progress |
| CY 2 - Create login and signup form and log off with auth persistence using localStorage | Todo |

## Four-week solo MERN e-commerce project plan

Build a focused MVP instead of trying to recreate a complete Shopify-style platform. Your application should demonstrate authentication, CRUD operations, database relationships, React integration, and deployment.

### 1. Project concept

A niche e-commerce application where:

- Visitors browse and search products.
- Users create accounts and log in.
- Logged-in users add products to a cart.
- Users place orders through a simulated checkout.
- Users see their previous orders.
- An admin manages the product catalogue.

## For the four-week version, do not integrate real payments unless every required feature is already finished. A simulated checkout is enough to demonstrate the full purchase flow.

## 2. Database models

You need at least three models.

### User

```javascript
{
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  }
}
```

The password must be hashed with `bcryptjs`.

### Product

```javascript
{
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  category: String,
  tags: [String],
  trending: {
    type: Boolean,
    default: false
  },
  discount:String,
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  }
}
```

`Product` will be your main full-CRUD non-user model.

### Cart

```javascript
({
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CartSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [CartItemSchema],
    total: {
      type: Number,
      min: 0,
      required: true,
      default: 0,
    },
  },
  { timestamps: true })
```

### Order

```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    required: true
  },
  items: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },
  date: {
    type: Date,
    default: Date.now
  }, 
  name: String,
  address: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  phone: String,
  email: {type: String, required: true},
  country: String, 
}, {
  timestamps: true
}
```

## Store the product price inside the order as well as the product reference. That preserves the purchase price if the product’s price changes later.

## 3. Backend API

Use a consistent `/api` prefix.

### Authentication routes

| Method | Endpoint         | Purpose                     | Protected |
| ------ | ---------------- | --------------------------- | --------- |
| POST   | /api/auth/signup | Register a user             | No        |
| POST   | /api/auth/login  | Authenticate and return JWT | No        |
| GET    | /api/auth/verify | Verify JWT and return user  | Yes       |

With JWT authentication, logout normally happens on the frontend by deleting the stored token.

### Product routes

| Method | Endpoint                 | Purpose                | Protected |
| ------ | ------------------------ | ---------------------- | --------- |
| GET    | /api/products            | Get all products       | No        |
| GET    | /api/products/:productId | Get one product        | No        |
| POST   | /api/products            | Create a product       | Admin     |
| PUT    | /api/products/:productId | Replace/update product | Admin     |
| DELETE | /api/products/:productId | Delete product         | Admin     |

This gives you the required full CRUD functionality.

### Order routes

| Method | Endpoint                    | Purpose                     | Protected |
| ------ | --------------------------- | --------------------------- | --------- |
| POST   | /api/orders                 | Place an order              | Yes       |
| GET    | /api/orders/my-orders       | Get logged-in user’s orders | Yes       |
| GET    | /api/orders/:orderId        | Get one owned order         | Yes       |
| PATCH  | /api/orders/:orderId/status | Update order status         | Admin     |

Use `.populate()` when returning order information:

```javascript
Order.findById(orderId)
  .populate("user", "name email")
  .populate("products.product");
```

---

## 4. Frontend pages

Use React Router to keep the application as a SPA.

| Route                           | Page                            | Access              |
| ------------------------------- | ------------------------------- | ------------------- |
| /                               | Home page                       | Public              |
| /products                       | Product catalogue               | Public              |
| /products/:productId            | Product details                 | Public              |
| /signup                         | Registration                    | Public              |
| /login                          | Login                           | Public              |
| /cart                           | Shopping cart                   | Public or protected |
| /checkout                       | Shipping and order confirmation | Protected           |
| /orders                         | User’s order history            | Protected           |
| /orders/:orderId                | Order details                   | Protected           |
| /admin/products                 | Admin product management        | Admin               |
| /admin/products/new             | Create product                  | Admin               |
| /admin/products/:productId/edit | Edit product                    | Admin               |
| *                               | Not-found page                  | Public              |

### Important frontend components

- `Navbar`
- `Footer`
- `ProductCard`
- `ProductList`
- `ProductForm`
- `SearchBar`
- `CategoryFilter`
- `CartItem`
- `ProtectedRoute`
- `AdminRoute`
- `LoadingSpinner`
- `ErrorMessage`

### React contexts

Use two separate contexts:

- `AuthContext`: current user, token, login, signup, logout.
- `CartContext`: cart items, quantities, totals, add and remove actions.

## You do not need to save the cart in MongoDB for the MVP. It can live in React state and `localStorage`.

# 5. Four-week schedule

## Week 1 — Planning and backend foundation

### Goal

Have the database, Express application, authentication, and initial product API working.

### Day 1: Project planning

- Choose the store niche and project name.
- Define the MVP and optional features.
- Create low-fidelity wireframes.
- Create a Trello, Notion, or GitHub Projects board.
- Write your user stories.
- Create two repositories:
   - `project-name-client`
   - `project-name-server`
- Initialize both projects.

### Day 2: Backend configuration

- Initialize Express.
- Install backend dependencies.
- Configure environment variables.
- Connect Mongoose to MongoDB.
- Configure CORS and `express.json()`.
- Add error handling and a 404 route.
- Create the project folder structure.

Suggested server structure:

```other
server/
├── config/
│   └── db.config.js
├── middleware/
│   ├── jwt.middleware.js
│   └── admin.middleware.js
├── models/
│   ├── User.model.js
│   ├── Product.model.js
│   └── Order.model.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── order.routes.js
├── seeds/
│   └── products.seed.js
├── app.js
└── server.js
```

### Day 3: Authentication

- Create the `User` model.
- Implement signup.
- Hash passwords.
- Implement login.
- Generate JWTs.
- Create JWT verification middleware.
- Test authentication routes.

### Day 4: Products

- Create the `Product` model.
- Create product seed data.
- Implement `GET`, `GET by ID`, and `POST`.
- Test routes with Postman or Insomnia.

### Day 5: Complete product CRUD

- Implement `PUT` and `DELETE`.
- Add admin authorization.
- Validate request data.
- Return appropriate status codes.
- Update the backend README.

### Week 1 milestone

By Friday:

- MongoDB is connected.
- Authentication works.
- Product CRUD works.
- Protected routes work.
- API routes have been tested independently.

---

## Week 2 — React foundation and product experience

### Goal

Users can register, log in, browse products, search products, and open product pages.

### Day 6: Frontend setup

- Create React/Vite application.
- Install Axios and React Router.
- Add the main page layout.
- Configure the Axios API client.
- Add environment variables.

Suggested client structure:

```other
client/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   │   └── api.service.js
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
└── .env
```

### Day 7: Authentication interface

- Create signup and login forms.
- Create `AuthContext`.
- Save the JWT.
- Add Axios authorization headers.
- Implement logout.
- Create `ProtectedRoute`.

### Day 8: Product catalogue

- Fetch products from the API.
- Display product cards.
- Add loading and error states.
- Handle empty results.

### Day 9: Product details

- Create the product details page.
- Fetch one product using `useParams()`.
- Add an “Add to cart” button.
- Handle invalid product IDs.

### Day 10: Search and filtering

- Add search by product name.
- Add category filtering.
- Add basic responsive styling.
- Test the complete browsing flow.

### Week 2 milestone

A deployed or local user can:

- Register.
- Log in and log out.
- Browse products.
- Search and filter products.
- View an individual product.

---

## Week 3 — Cart, orders, and admin CRUD

### Goal

Complete the e-commerce flow and connect every major frontend feature to the API.

### Day 11: Shopping cart

- Create `CartContext`.
- Add products to the cart.
- Change quantities.
- Remove products.
- Calculate subtotal.
- Save the cart in `localStorage`.

### Day 12: Order backend

- Create the `Order` model.
- Create an order route.
- Verify product IDs and quantities.
- Calculate totals on the server.
- Add user-order routes.
- Use `.populate()`.

Never trust a total sent by the frontend. Retrieve product prices and calculate the total on the server.

### Day 13: Checkout

- Create shipping-address form.
- Display an order summary.
- Submit the order.
- Clear the cart after success.
- Redirect to the order confirmation page.

### Day 14: Order history

- Display the logged-in user’s orders.
- Create an order details page.
- Ensure users cannot access other users’ orders.
- Handle loading, empty, and error states.

### Day 15: Admin product interface

- Create the admin products page.
- Create the product form.
- Connect create, edit, and delete operations.
- Add confirmation before deletion.
- Protect the interface with an admin route.

### Week 3 milestone

The main journey must work:

```other
flowchart TD
    A["Browse products"] --> B["View product"]
    B --> C["Add to cart"]
    C --> D["Log in"]
    D --> E["Checkout"]
    E --> F["Order created"]
    F --> G["View order history"]
```

## The admin must also be able to perform complete product CRUD.

## Week 4 — Testing, deployment, documentation, and presentation

### Goal

Finish early enough to fix deployment and presentation problems.

### Day 16: Complete unfinished requirements

- Review the rubric line by line.
- Remove unfinished navigation links.
- Fix authentication persistence.
- Improve form validation.
- Add success and error feedback.

### Day 17: Testing and code quality

Test:

- Signup with a duplicate email.
- Login with the wrong password.
- Expired or invalid JWT.
- Protected pages without authentication.
- Product not found.
- Empty product catalogue.
- Adding the same product twice.
- Empty cart checkout.
- Order access by the wrong user.
- API and database failures.

Also:

- Remove unused code and console logs.
- Use clear variable and function names.
- Break oversized components into smaller components.

### Day 18: Deployment

- Deploy the backend.
- Configure production environment variables.
- Deploy the frontend.
- Add the deployed frontend URL to backend CORS.
- Add the deployed backend URL to the frontend environment.
- Test the application using the public URLs.

### Day 19: Documentation

Complete both READMEs with:

- Project description.
- Features.
- Technologies.
- Installation instructions.
- Environment variables.
- API endpoints.
- Data models.
- Screenshots.
- Deployed application link.
- Repository links.
- Known limitations.
- Future improvements.

### Day 20: Presentation and final rehearsal

- Create presentation slides.
- Prepare a five-to-seven-minute demo.
- Test all demo accounts.
- Seed stable demo products.
- Rehearse the exact user journey.
- Prepare a backup video or screenshots.
- Make final commits and verify all links.

---

# 6. Agile setup

## Kanban columns

Use:

- Backlog
- Ready
- In progress
- Review/Test
- Done

Only keep one major task in “In progress” at a time because you are working alone.

## Example user stories

```other
As a visitor, I want to browse products so that I can discover what the store sells.

As a visitor, I want to create an account so that I can place an order.

As a customer, I want to add products to my cart so that I can purchase several products together.

As a customer, I want to see my previous orders so that I can review my purchases.

As an admin, I want to create, edit, and delete products so that I can manage the catalogue.
```

## Daily stand-up

Write a short entry every morning:

```other
Yesterday:
- Completed the Product model and GET routes.

Today:
- Implement POST and PUT product routes.
- Test product validation.

Blockers:
- Product image is not appearing in the frontend.
```

A stand-up is for reporting and planning. You normally do not complete development tasks during the stand-up itself.

## Definition of Done

A task is done only when:

- The feature meets its acceptance criteria.
- Frontend and backend are connected where applicable.
- Loading and error states are handled.
- Protected operations require authentication.
- The feature has been manually tested.
- There are no important console errors.
- Code has been committed with a clear message.
- Documentation has been updated if necessary.

---

# 7. Git strategy

Because you are working alone, keep the workflow simple:

- `main`: stable code.
- Feature branches such as:
   - `feature/authentication`
   - `feature/product-crud`
   - `feature/cart`
   - `feature/orders`

Make at least two meaningful commits per working day in each repository when work occurred there. Do not create empty or artificial commits.

Good examples:

```other
feat: add product creation endpoint
feat: display products from API
fix: persist authenticated user after refresh
refactor: move order calculations to service
docs: document authentication endpoints
```

## Push your work every day so you have a remote backup.

# 8. Presentation structure

Keep the deck to approximately 8–10 slides:

1. Project name and one-sentence pitch.
2. Problem and target user.
3. Main features.
4. Demo user journey.
5. Technologies used.
6. Database models and relationships.
7. Main technical challenge.
8. Agile process and project timeline.
9. Future improvements.
10. Repository links and live application.

During the live demo, show:

1. Product browsing.
2. Signup or login.
3. Cart interaction.
4. Checkout.
5. Order history.
6. Admin product CRUD.

---

# 9. MVP versus optional features

## Required MVP

- Signup, login, logout.
- JWT authentication.
- Three Mongoose models.
- Complete product CRUD.
- Product catalogue and details.
- Shopping cart.
- Simulated checkout.
- Order creation and history.
- Protected routes.
- Responsive styling.
- Deployment.
- READMEs and presentation.

## Only add if the MVP is complete

- Product reviews.
- Wishlist.
- Image uploads.
- Pagination.
- Discount codes.
- Stripe payments.
- Stock reduction.
- Email confirmations.
- Advanced admin dashboard.

The safest target is to finish the complete MVP by the end of Week 3. Week 4 should be reserved for testing, deployment, documentation, and the final presentation—not for introducing major new functionality.

