'use client'

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { initialCheckoutForm1Data } from '@/components/data/checkout-form-1-data'
import { CheckoutForm1ContactStep } from './checkout-form-1-contact-step'
import { CheckoutForm1OrderSummary } from './checkout-form-1-order-summary'
import { CheckoutForm1PaymentStep } from './checkout-form-1-payment-step'
import { CheckoutForm1Progress } from './checkout-form-1-progress'
import { CheckoutForm1ShippingStep } from './checkout-form-1-shipping-step'
import { AuthContext } from '../context/auth.context'
import { createOrder } from '../services/ordersService'
import { clearCart, getCart } from '../services/cartService'

const STEP_COPY = [
  { title: 'Contact Information', description: "We'll use this to send you order updates" },
  { title: 'Shipping Address', description: 'Where should we deliver your order?' },
  { title: 'Payment Details', description: 'Your payment information is secure and encrypted' },
]

export function CheckoutForm1() {
  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AuthContext)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialCheckoutForm1Data)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn, navigate])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCardNumberChange = (value) => {
    const formatted = value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
    handleInputChange('cardNumber', formatted)
  }

  const handleExpiryChange = (value) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
    handleInputChange('expiryDate', formatted)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, STEP_COPY.length))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const cart = await getCart()
      const cartProducts = Array.isArray(cart?.products) ? cart.products : []

      if (!cartProducts.length) {
        throw new Error('Your cart is empty.')
      }

      const products = cartProducts.map((item) => ({
        product: item?.product?._id || item?.product,
        quantity: Number(item?.quantity ?? 1),
        price: Number(item?.price ?? 0),
      }))

      const orderPayload = {
        status: 'confirmed',
        products,
        total: Number(cart?.total ?? 0),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        country: formData.country,
      }

      await createOrder(orderPayload)
        await clearCart()
      navigate('/orders', { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Unable to complete your order.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-muted/30'>
      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-balance'>Secure Checkout</h1>
          <p className='text-muted-foreground'>Complete your purchase in just a few steps</p>
        </div>

        <CheckoutForm1Progress step={step} />

        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-balance'>{STEP_COPY[step - 1].title}</CardTitle>
                <CardDescription>{STEP_COPY[step - 1].description}</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-6'>
                {error && (
                  <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
                    {error}
                  </div>
                )}

                {step === 1 ? <CheckoutForm1ContactStep formData={formData} onChange={handleInputChange} /> : null}

                {step === 2 ? <CheckoutForm1ShippingStep formData={formData} onChange={handleInputChange} /> : null}

                {step === 3 ? (
                  <CheckoutForm1PaymentStep
                    formData={formData}
                    onChange={handleInputChange}
                    onCardNumberChange={handleCardNumberChange}
                    onExpiryChange={handleExpiryChange}
                  />
                ) : null}

                <div className='flex justify-between pt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={prevStep}
                    disabled={step === 1}
                    className='h-9 cursor-pointer px-4 py-2'
                  >
                    <ArrowLeft data-icon='inline-start' />
                    Back
                  </Button>

                  {step < STEP_COPY.length ? (
                    <Button onClick={nextStep} className='h-9 cursor-pointer px-4 py-2'>
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className='h-9 cursor-pointer px-4 py-2' disabled={isSubmitting}>
                      <Lock data-icon='inline-start' />
                      {isSubmitting ? 'Processing...' : 'Complete Order'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <CheckoutForm1OrderSummary
              promoCode={formData.promoCode}
              onPromoCodeChange={(value) => handleInputChange('promoCode', value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm1
