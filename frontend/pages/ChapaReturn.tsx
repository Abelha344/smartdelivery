
import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Printer, Home, FileText } from 'lucide-react';
import jsConfetti from 'js-confetti';

export const ChapaReturn: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useStore();
    const effectRan = useRef(false);
    
    // Params from backend redirect
    const orderId = searchParams.get('orderId') || 'N/A';
    const tx_ref = searchParams.get('tx_ref') || 'N/A';
    const amount = searchParams.get('amount') || '0.00';
    const name = searchParams.get('name') || 'Customer';
    const dateStr = searchParams.get('date');
    
    const formattedDate = dateStr ? new Date(dateStr).toLocaleString() : new Date().toLocaleString();

    useEffect(() => {
        // Run cleanup exactly once
        if (!effectRan.current) {
            console.log("Receipt Page Loaded - Waiting for User Action");
            clearCart();
            const confetti = new jsConfetti();
            confetti.addConfetti();
            effectRan.current = true;
        }
        // STRICTLY NO AUTO-REDIRECT HERE
    }, [clearCart]);

    const handlePrint = () => {
        window.print();
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 print:bg-white print:p-0">
            {/* Print Styles */}
            <style>
                {`
                    @media print {
                        @page { margin: 0; size: auto; }
                        body * { visibility: hidden; }
                        #receipt-container, #receipt-container * { visibility: visible; }
                        #receipt-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            margin: 0;
                            padding: 20px;
                            box-shadow: none;
                            border: none;
                            background: white;
                        }
                        .no-print { display: none !important; }
                    }
                `}
            </style>

            <div id="receipt-container" className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                
                {/* Success Header */}
                <div className="bg-green-600 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-white/10 no-print">
                        <CheckCircle className="text-white w-10 h-10" />
                    </div>
                    
                    <h1 className="text-2xl font-bold mb-1">Payment Successful</h1>
                    <p className="text-green-100 text-sm">Your order has been confirmed.</p>
                </div>

                {/* Receipt Details */}
                <div className="p-8">
                    <div className="space-y-4 mb-8 text-sm text-gray-600">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span>Order ID</span>
                            <span className="font-mono font-bold text-gray-900">#{orderId.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span>Date</span>
                            <span className="font-medium text-gray-900">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span>Customer</span>
                            <span className="font-medium text-gray-900">{name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span>Transaction Ref</span>
                            <span className="font-mono text-xs">{tx_ref}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-lg text-gray-900">Total Paid</span>
                            <span className="font-bold text-xl text-green-600">{amount} ETB</span>
                        </div>
                    </div>

                    {/* TWO EXPLICIT OPTIONS - NO AUTO REDIRECT */}
                    <div className="space-y-3 no-print">
                        <button 
                            onClick={handlePrint}
                            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                            <Printer size={20} />
                            Print Receipt
                        </button>

                        <button 
                            onClick={handleHome}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Go to Home
                        </button>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-400 print:hidden">
                        You can also track this order in "My Orders".
                    </div>
                    
                    {/* Print Footer */}
                    <div className="hidden print:block mt-8 text-center text-xs text-gray-500 pt-8 border-t border-gray-300">
                        <p className="font-bold text-sm text-gray-900">Mekelle Delivery Service</p>
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
