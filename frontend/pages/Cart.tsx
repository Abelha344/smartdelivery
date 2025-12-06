
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, Banknote, MapPin, CheckCircle, Lock, ArrowLeft, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { PaymentMethod } from '../types';

export const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, placeOrder, initializeChapaPayment, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '', 
    paymentMethod: PaymentMethod.CASH
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 50; 
  const grandTotal = total + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.paymentMethod === PaymentMethod.CHAPA) {
        // Initialize Chapa Flow
        console.log("Initializing Chapa payment...");
        try {
            const result = await initializeChapaPayment({
                address: formData.address,
                phone: formData.phone
            });

            if (result.success && result.url) {
                console.log("Chapa URL received:", result.url);
                console.log("Redirect URL length:", result.url.length); // NEW: CHECK URL LENGTH
                setPaymentUrl(result.url);
                setRedirecting(true);
                
                // FIX: Force a redirect by opening a new, separate tab
                window.open(result.url, '_blank'); 
            
                // Stop showing the loading state in the current window
                setLoading(false);
                setRedirecting(false); 
            } else {
                console.error("Chapa Init Failed:", result.message);
                alert(`Payment Error: ${result.message || 'Unknown error occurred'}`);
                setLoading(false);
                setRedirecting(false);
            }
        } catch (error) {
            console.error("Payment exception:", error);
            alert("An unexpected error occurred. Please check console.");
            setLoading(false);
            setRedirecting(false);
        }
    } else {
        // Standard Cash Order
        await placeOrder({
          address: formData.address,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod
        });
        setLoading(false);
        setStep('success');
        triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50 overflow-hidden';
    document.body.appendChild(confettiContainer);
    
    for(let i=0; i<50; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.animationDelay = Math.random() * 2 + 's';
        conf.style.backgroundColor = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'][Math.floor(Math.random()*5)];
        confettiContainer.appendChild(conf);
    }
    
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000);
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="text-green-600 w-12 h-12" />
           </div>
           <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
           <p className="text-gray-600 mb-8">Thank you for ordering. Your food is being prepared and will be with you shortly.</p>
           <div className="flex flex-col gap-3">
             <button onClick={() => navigate('/orders')} className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">Track Order</button>
             <button onClick={() => navigate('/restaurants')} className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">Continue Shopping</button>
           </div>
        </div>
      </div>
    );
  }

  // Full Screen Loading State for Redirect
  if (redirecting) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 z-50 fixed inset-0">
              <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Payment...</h2>
                  <p className="text-gray-500 mb-6">Securely connecting to Chapa.</p>
                  
                  {/* Robust Manual Link */}
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 animate-fade-in">
                      <div className="flex items-center gap-2 text-orange-800 font-bold mb-2 justify-center">
                          <AlertTriangle size={18} />
                          <span>Taking too long?</span>
                      </div>
                      <a 
                         href={paymentUrl || '#'}
                         className="block w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors text-center shadow-md"
                      >
                         Click Here to Pay Now
                      </a>
                  </div>
              </div>
          </div>
      );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/restaurants')} className="text-orange-600 hover:text-orange-700 font-medium">Browse Restaurants</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors font-medium">
             <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{step === 'cart' ? 'Shopping Cart' : 'Checkout'}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
             {step === 'cart' ? (
               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                 <ul className="divide-y divide-gray-200">
                   {cart.map(item => (
                     <li key={item.id} className="p-6 flex items-center">
                       <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                       <div className="ml-4 flex-1">
                         <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                         <p className="text-sm text-gray-500">{item.price} ETB</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button onClick={() => updateCartQuantity(item.id, -1)} className="p-2 hover:bg-gray-100 text-gray-600"><Minus size={16} /></button>
                            <span className="px-2 font-medium">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus size={16} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 size={20} />
                          </button>
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>
             ) : (
               <form id="checkout-form" onSubmit={handleCheckout} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                       <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                       </div>
                       <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                       </div>
                       <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                             <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="e.g., Kebele 16, near Romanat" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm border-gray-300" />
                             <button type="button" className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                               <MapPin size={16} />
                             </button>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">You can add specific landmarks in the address field.</p>
                       </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div 
                         onClick={() => setFormData({...formData, paymentMethod: PaymentMethod.CASH})}
                         className={`cursor-pointer border rounded-lg p-4 flex items-center transition-all ${formData.paymentMethod === PaymentMethod.CASH ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}
                       >
                         <Banknote className={`h-6 w-6 mr-3 ${formData.paymentMethod === PaymentMethod.CASH ? 'text-orange-600' : 'text-gray-400'}`} />
                         <span className="font-medium text-gray-900">Cash on Delivery</span>
                       </div>
                       <div 
                         onClick={() => setFormData({...formData, paymentMethod: PaymentMethod.CHAPA})}
                         className={`cursor-pointer border rounded-lg p-4 flex items-center transition-all ${formData.paymentMethod === PaymentMethod.CHAPA ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}
                       >
                         <CreditCard className={`h-6 w-6 mr-3 ${formData.paymentMethod === PaymentMethod.CHAPA ? 'text-orange-600' : 'text-gray-400'}`} />
                         <span className="font-medium text-gray-900">Chapa (Telebirr/Bank)</span>
                       </div>
                    </div>
                  </div>
               </form>
             )}
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">{total} ETB</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Delivery Fee</dt>
                    <dd className="font-medium text-gray-900">{deliveryFee} ETB</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-orange-600">{grandTotal} ETB</dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-6">
                {step === 'cart' ? (
                   !user ? (
                      <button onClick={() => navigate('/sign-in')} className="w-full flex justify-center items-center gap-2 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900">
                         <Lock size={16} />
                         Login to Checkout
                      </button>
                   ) : (
                      <button onClick={() => setStep('checkout')} className="w-full flex justify-center py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
                        Proceed to Checkout
                      </button>
                   )
                ) : (
                   <div className="space-y-3">
                      <button 
                        type="submit" 
                        form="checkout-form" 
                        disabled={loading || redirecting}
                        className="w-full flex justify-center py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                      >
                        {loading || redirecting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" /> {redirecting ? 'Processing...' : 'Place Order'}
                          </div>
                        ) : (formData.paymentMethod === PaymentMethod.CHAPA ? 'Pay with Chapa' : 'Confirm Order')}
                      </button>
                      <button disabled={loading || redirecting} onClick={() => setStep('cart')} className="w-full flex justify-center py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        Back to Cart
                      </button>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


















































