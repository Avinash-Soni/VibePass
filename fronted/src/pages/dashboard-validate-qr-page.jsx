"use strict";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ Your custom context
import { Scanner } from "@yudiel/react-qr-scanner";
import { AlertCircle, Check, X, Scan, Keyboard, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TicketValidationMethod, TicketValidationStatus } from "@/domain/domain";
import { validateTicket } from "@/lib/api";
import { cn } from "@/lib/utils";

const DashboardValidateQrPage = () => {
  const { isLoading, token } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [validationStatus, setValidationStatus] = useState(undefined);

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleValidate = async (id, method) => {
    // 1. Use 'token' instead of 'user.access_token'
    if (!token || !id) return;
    
    try {
      setError(undefined);
      // 2. Pass 'token' to the API helper
      const response = await validateTicket(token, { id, method });
      setValidationStatus(response.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
      setValidationStatus(TicketValidationStatus.INVALID);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 selection:bg-primary/30">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Information */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Entry Gate</h1>
          <p className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">Verification System</p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/20 animate-in fade-in zoom-in-95">
            <AlertCircle className="size-4" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* Scanner Viewport */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-4 border-white/5 bg-gray-900 shadow-2xl">
          {!isManual && (
            <Scanner
              key={`scanner-${data}-${validationStatus}`}
              onScan={(result) => {
                if (result?.[0]?.rawValue) {
                  const qrId = result[0].rawValue;
                  setData(qrId);
                  handleValidate(qrId, TicketValidationMethod.QR_SCAN);
                }
              }}
              onError={(err) => setError(err?.message || "Scanner error")}
              className="size-full object-cover"
            />
          )}

          {/* Target Frame Overlay */}
          {!validationStatus && !isManual && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-64 border-2 border-primary/50 rounded-3xl animate-pulse flex items-center justify-center">
                <Scan className="size-12 text-primary opacity-20" />
              </div>
            </div>
          )}

          {/* Validation Feedback Overlays */}
          {validationStatus && (
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 animate-in fade-in zoom-in",
              validationStatus === TicketValidationStatus.VALID ? "bg-emerald-500/80" : "bg-rose-500/80"
            )}>
              <div className="bg-white/20 rounded-full p-6 shadow-2xl">
                {validationStatus === TicketValidationStatus.VALID ? (
                  <Check className="size-24 text-white stroke-[3px]" />
                ) : (
                  <X className="size-24 text-white stroke-[3px]" />
                )}
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tighter uppercase text-white">
                {validationStatus}
              </h2>
            </div>
          )}
        </div>

        {/* Data Display & Controls */}
        <div className="space-y-4">
          <div className="h-14 bg-gray-900 border border-white/10 rounded-2xl flex items-center justify-center font-mono text-sm tracking-widest text-primary shadow-inner">
            {data || "AWAITING INPUT..."}
          </div>

          {!isManual ? (
            <Button
              className="w-full h-20 text-lg font-bold bg-white text-black hover:bg-gray-200 rounded-2xl transition-transform active:scale-95"
              onClick={() => setIsManual(true)}
            >
              <Keyboard className="mr-3 size-6" />
              Manual Entry
            </Button>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-2">
              <Input
                autoFocus
                className="h-16 bg-gray-900 border-white/10 text-center text-xl font-bold rounded-2xl focus:ring-primary"
                placeholder="Enter Ticket ID"
                onChange={(e) => setData(e.target.value)}
              />
              <Button
                className="w-full h-20 text-lg font-bold bg-primary text-black hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-transform active:scale-95"
                onClick={() => handleValidate(data || "", TicketValidationMethod.MANUAL)}
              >
                Validate ID
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full h-16 text-gray-500 font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white rounded-2xl"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 size-4" />
            Reset Scanner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;