"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { CheckCircle, CreditCard, User, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { cn } from "@/lib/utils";

// Helper Components defined at the top
const AlertCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const Info = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);

const PurchaseTicketPage = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading: isAuthLoading, token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false); // Track sold out status

  useEffect(() => {
    if (!isPurchaseSuccess) return;
    
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess, navigate]);

  const handlePurchase = async () => {
    if (isAuthLoading || !token || !eventId || !ticketTypeId) return;
    
    try {
      setIsProcessing(true);
      setError(undefined);
      
      await purchaseTicket(token, eventId, ticketTypeId);
      setIsPurchaseSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "The transaction could not be completed.";
      
      // If backend says sold out, update the UI state instead of showing a red alert
      if (errorMessage.toLowerCase().includes("sold out")) {
        setIsSoldOut(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPurchaseSuccess) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
        <div className="relative space-y-6 text-center">
          <div className="relative size-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <CheckCircle className="size-20 text-emerald-500 relative z-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter text-white">Order Confirmed!</h2>
            <p className="text-gray-400 font-medium">Your pass has been added to your digital wallet.</p>
          </div>
          <div className="w-48 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-primary animate-[progress_4s_linear]" />
          </div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary/30 flex flex-col">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-white group">
          <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </Button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <ShieldCheck className="size-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Checkout</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 size-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <header className="text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Complete Purchase</h1>
                <p className="text-sm text-gray-500 font-medium">Enter your payment details to secure your spot.</p>
              </header>

              {/* General Errors (Non-sold out) still show here */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-in slide-in-from-top-2">
                  <div className="flex gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Card Number</Label>
                  <div className="relative">
                    <Input
                      disabled={isSoldOut}
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      className="bg-gray-950 border-white/10 h-12 pl-11 text-lg font-mono tracking-widest focus:ring-primary/20"
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Cardholder Name</Label>
                  <div className="relative">
                    <Input
                      disabled={isSoldOut}
                      type="text"
                      placeholder="John Smith"
                      className="bg-gray-950 border-white/10 h-12 pl-11 font-medium focus:ring-primary/20"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Expiry</Label>
                    <Input disabled={isSoldOut} placeholder="MM / YY" className="bg-gray-950 border-white/10 h-12 text-center font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">CVC</Label>
                    <Input disabled={isSoldOut} placeholder="•••" className="bg-gray-950 border-white/10 h-12 text-center font-mono" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  disabled={isProcessing || isSoldOut}
                  className={cn(
                    "w-full h-14 font-black text-lg rounded-2xl transition-all",
                    isSoldOut 
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-not-allowed" 
                      : "bg-primary text-black hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-[0.98]"
                  )}
                  onClick={handlePurchase}
                >
                  {isProcessing ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : isSoldOut ? (
                    "Tickets Sold Out"
                  ) : (
                    "Authorize Payment"
                  )}
                </Button>
                
                {isSoldOut && (
                  <p className="text-center text-[10px] font-bold text-rose-400/60 uppercase tracking-widest mt-4 animate-pulse">
                    This ticket type is no longer available
                  </p>
                )}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <Info className="size-3 text-gray-500" />
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
                    Portfolio Mode: No real data will be processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Secure Gateway Protocol 2.6.0</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default PurchaseTicketPage;