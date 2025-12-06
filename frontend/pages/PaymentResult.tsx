
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, XCircle, Printer, Download, Home, Smartphone, AlertCircle } from 'lucide-react';
import jsConfetti from 'js-confetti';

const getApiUrl = () => {
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api`;
};

const API_URL = getApiUrl();

export const PaymentResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useStore();
    const status = window.location.pathname.includes('success') ? 'success' : 'failed';
    const [showToast, setShowToast] = useState(false);
    const smsSentRef = useRef(false);
    
    const tx_ref = searchParams.get('tx_ref');
    const orderId = searchParams.get('orderId') || 'N/A';
    const amount = searchParams.get('amount') || '0.00';
    const dateStr = searchParams.get('date');
    const name = searchParams.get('name') || 'Customer';
    const phone = searchParams.get('phone') || '';
    const message = searchParams.get('message');

    const formattedDate = dateStr ? new Date(dateStr).toLocaleString() : new Date().toLocaleString();

    useEffect(() => {
        // Only run once on mount
        if (status === 'success' && !smsSentRef.current) {
            clearCart();
            const confetti = new jsConfetti();
            confetti.addConfetti();
            
            // Trigger SMS in background
            sendSms();
            smsSentRef.current = true;
        }
    }, [status]); // eslint-disable-line

    const sendSms = async () => {
        try {
            await fetch(`${API_URL}/notifications/sms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phone,
                    orderId: orderId,
                    customerName: name
                })
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        } catch (error) {
            console.error("SMS Failed", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const receiptText = `
MDS - Mekelle Delivery Service
PAYMENT RECEIPT
------------------------------
Status:       SUCCESS
Order ID:     #${orderId.slice(-6).toUpperCase()}
Date:         ${formattedDate}
Customer:     ${name}
Method:       Chapa Bank Transfer
Amount Paid:  ${amount} ETB
Reference:    ${tx_ref}
------------------------------
Thank you for your business!
        `;
        
        const blob = new Blob([receiptText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${orderId}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="text-red-600 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again or use Cash on Delivery.</p>
                    
                    {message && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-left text-sm">
                            <AlertCircle size={16} className="flex-shrink-0" />
                            <span>Error: {message}</span>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate('/cart')} className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-200">Try Again</button>
                        <button onClick={() => navigate('/')} className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 print:bg-white print:p-0">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-3">
                    <Smartphone size={20} />
                    <div>
                        <p className="font-bold text-xs uppercase tracking-wider">SMS Sent</p>
                        <p className="text-sm">Confirmation sent to phone</p>
                    </div>
                </div>
            )}

            <div className="bg-white p-0 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden print:shadow-none print:max-w-none">
                {/* Receipt Header */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 text-center text-white print:bg-white print:text-black print:border-b-2 print:border-black">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 print:hidden shadow-inner">
                        <CheckCircle className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Payment Successful</h1>
                    <p className="text-green-100 text-sm font-medium print:text-gray-500">Your order has been placed!</p>
                </div>

                {/* Receipt Body */}
                <div className="p-6 sm:p-8">
                    <div className="border-b border-dashed border-gray-300 pb-6 mb-6 space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Order ID</span>
                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">#{orderId.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Customer</span>
                            <span className="font-bold text-gray-900">{name}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Date</span>
                            <span className="font-bold text-gray-900">{formattedDate}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="text-gray-600 font-bold">Total Paid</span>
                        <span className="text-2xl font-extrabold text-green-700">{amount} <span className="text-sm font-normal text-gray-500">ETB</span></span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 print:hidden">
                        <div className="grid grid-cols-2 gap-3">
                             <button 
                                onClick={handlePrint}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
                            >
                                <Printer size={18} /> Print
                            </button>
                            <button 
                                onClick={handleDownload}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
                            >
                                <Download size={18} /> Save
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                        >
                            <Home size={20} /> Return Home
                        </button>
                    </div>

                    <div className="mt-6 text-center text-[10px] text-gray-400 print:hidden uppercase tracking-wider">
                        Smart Delivery Service
                    </div>
                </div>
            </div>
        </div>
    );
};





















