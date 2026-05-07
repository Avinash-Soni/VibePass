"use strict";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Scanner } from "@yudiel/react-qr-scanner";

import {
  AlertCircle,
  Check,
  X,
  Scan,
  Keyboard,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";

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
    if (!token || !id) return;

    try {
      setError(undefined);

      const response = await validateTicket(token, {
        id,
        method,
      });

      setValidationStatus(response.status);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Validation failed"
      );

      setValidationStatus(
        TicketValidationStatus.INVALID
      );
    }
  };

  // LOADER
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden">
        
        {/* BACKGROUND */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 blur-[160px] rounded-full" />
        </div>

        <div className="relative">
          <div className="size-20 rounded-full border-4 border-primary/20" />

          <div className="absolute inset-0 size-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-primary/30">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:55px_55px]" />

        {/* GLOW */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 blur-[180px] rounded-full" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[160px] rounded-full" />

        {/* FLOATING LIGHTS */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{
              opacity: 0.2,
              scale: 0.5,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4 + i * 0.2,
              repeat: Infinity,
            }}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >

          {/* HEADER */}
          <div className="text-center mb-8">
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
              }}
              className="mx-auto mb-5 size-20 rounded-[28px] bg-primary flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.45)]"
            >
              <ShieldCheck className="size-10 text-black" />
            </motion.div>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-primary font-black mb-5">
              <Sparkles className="size-3" />
              Secure Entry System
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Entry Gate
            </h1>

            <p className="text-gray-400 mt-3 text-sm sm:text-base">
              Scan tickets instantly with real-time validation.
            </p>
          </div>

          {/* ERROR */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                className="mb-5"
              >
                <Alert className="bg-rose-500/10 border border-rose-500/20 rounded-3xl text-white backdrop-blur-xl">
                  <AlertCircle className="size-5 text-rose-400" />

                  <AlertTitle className="font-black">
                    Validation Error
                  </AlertTitle>

                  <AlertDescription className="text-gray-300">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SCANNER CARD */}
          <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(168,85,247,0.15)]"
          >

            {/* TOP LINE */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

            <div className="p-5 sm:p-6">

              {/* SCANNER */}
              <div className="relative aspect-square rounded-[28px] overflow-hidden border border-white/10 bg-black">

                {!isManual && (
                  <Scanner
                    key={`scanner-${data}-${validationStatus}`}
                    onScan={(result) => {
                      if (result?.[0]?.rawValue) {
                        const qrId =
                          result[0].rawValue;

                        setData(qrId);

                        handleValidate(
                          qrId,
                          TicketValidationMethod.QR_SCAN
                        );
                      }
                    }}
                    onError={(err) =>
                      setError(
                        err?.message ||
                          "Scanner error"
                      )
                    }
                    className="size-full object-cover"
                  />
                )}

                {/* TARGET */}
                {!validationStatus && !isManual && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                    <motion.div
                      animate={{
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="size-60 sm:size-64 rounded-[32px] border-2 border-primary/50 flex items-center justify-center"
                    >
                      <Scan className="size-12 text-primary/40" />
                    </motion.div>

                    {/* SCAN LINE */}
                    <motion.div
                      animate={{
                        y: [-110, 110],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="absolute w-52 sm:w-56 h-[2px] bg-primary shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                    />
                  </div>
                )}

                {/* VALIDATION OVERLAY */}
                <AnimatePresence>
                  {validationStatus && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-xl",
                        validationStatus ===
                          TicketValidationStatus.VALID
                          ? "bg-emerald-500/80"
                          : "bg-rose-500/80"
                      )}
                    >
                      <motion.div
                        initial={{
                          scale: 0.5,
                          rotate: -15,
                        }}
                        animate={{
                          scale: 1,
                          rotate: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                        }}
                        className="bg-white/20 rounded-full p-6 shadow-2xl"
                      >
                        {validationStatus ===
                        TicketValidationStatus.VALID ? (
                          <Check className="size-24 text-white stroke-[3px]" />
                        ) : (
                          <X className="size-24 text-white stroke-[3px]" />
                        )}
                      </motion.div>

                      <h2 className="mt-6 text-3xl font-black uppercase tracking-tight">
                        {validationStatus}
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DATA */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center font-mono text-sm tracking-widest text-primary overflow-hidden">
                {data || "AWAITING INPUT..."}
              </div>

              {/* MANUAL / BUTTONS */}
              <div className="mt-5 space-y-4">

                {!isManual ? (
                  <Button
                    onClick={() =>
                      setIsManual(true)
                    }
                    className="w-full h-16 rounded-2xl bg-white text-black hover:bg-gray-200 font-black text-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Keyboard className="mr-3 size-5" />
                    Manual Entry
                  </Button>
                ) : (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="space-y-4"
                  >
                    <Input
                      autoFocus
                      placeholder="Enter Ticket ID"
                      className="h-16 rounded-2xl border-white/10 bg-white/[0.03] text-center text-lg font-bold text-white focus-visible:ring-primary"
                      onChange={(e) =>
                        setData(
                          e.target.value
                        )
                      }
                    />

                    <Button
                      onClick={() =>
                        handleValidate(
                          data || "",
                          TicketValidationMethod.MANUAL
                        )
                      }
                      className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black text-lg shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                    >
                      <Zap className="mr-2 size-5" />
                      Validate Ticket
                    </Button>
                  </motion.div>
                )}

                {/* RESET */}
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="w-full h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 hover:text-white font-bold"
                >
                  <RefreshCw className="mr-2 size-4" />
                  Reset Scanner
                </Button>
              </div>
            </div>
          </motion.div>

          {/* FOOTER */}
          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-gray-600 mt-8">
            Powered by VibePass Protocol
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;