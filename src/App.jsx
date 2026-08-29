import { Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/auth.context'
import Header from './components/header'
import Footer from './components/footer'
import Homepage from './pages/Homepage'
import Login from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import OrderHistory from "./pages/OrderHistory"
import OrderDetails from './pages/OrderDetails'
import Cartpage from './pages/Cartpage'
import NotFound from './pages/NotFound'
import CheckoutPage from './pages/CheckoutPage'


function App() {
  const { loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App width-full align-center m-4">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<OrderHistory/>} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/checkout' element={<CheckoutPage />} />
              </Routes>
      <Footer />
    </div>
  )
}

export default App