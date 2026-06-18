import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LeadProvider } from './context/LeadContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { ShippingProvider } from './context/ShippingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <LeadProvider>
          <OrderProvider>
            <ShippingProvider>
              <App />
            </ShippingProvider>
          </OrderProvider>
        </LeadProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>,
)
