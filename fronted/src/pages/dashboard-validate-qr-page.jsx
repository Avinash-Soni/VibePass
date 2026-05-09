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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="size-12 rounded-full border-4 border-primary/20" />

          <div className="absolute inset-0 size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-primary/30">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-primary/20 blur-[130px] rounded-full" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[320px] h-[320px] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-2 py-2">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[300px]"
        >

          {/* HEADER */}
          <div className="text-center mb-4">

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
              }}
              className="mx-auto mb-2 size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <ShieldCheck className="size-6 text-black" />
            </motion.div>

            <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-primary font-black mb-2">
              <Sparkles className="size-2" />
              Secure Entry
            </div>

            <h1 className="text-2xl font-black tracking-tight">
              Entry Gate
            </h1>

            <p className="text-gray-400 mt-1 text-[11px]">
              Real-time QR validation
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
                className="mb-3"
              >
                <Alert className="bg-rose-500/10 border border-rose-500/20 rounded-xl text-white backdrop-blur-xl p-3">
                  <AlertCircle className="size-4 text-rose-400" />

                  <AlertTitle className="font-black text-xs">
                    Validation Error
                  </AlertTitle>

                  <AlertDescription className="text-gray-300 text-[10px]">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SCANNER CARD */}
          <motion.div
            whileHover={{ y: -1 }}
            className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_40px_rgba(168,85,247,0.12)]"
          >

            <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

            <div className="p-3">

              {/* SCANNER */}
              <div className="relative aspect-square rounded-[18px] overflow-hidden border border-white/10 bg-black">

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

                {!validationStatus && !isManual && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="size-36 rounded-[20px] border-2 border-primary/50 flex items-center justify-center"
                    >
                      <Scan className="size-7 text-primary/40" />
                    </motion.div>

                    <motion.div
                      animate={{
                        y: [-65, 65],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="absolute w-32 h-[2px] bg-primary shadow-[0_0_20px_rgba(168,85,247,0.8)]"
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
                      <div className="bg-white/20 rounded-full p-3 shadow-2xl">
                        {validationStatus ===
                        TicketValidationStatus.VALID ? (
                          <Check className="size-14 text-white stroke-[3px]" />
                        ) : (
                          <X className="size-14 text-white stroke-[3px]" />
                        )}
                      </div>

                      <h2 className="mt-3 text-xl font-black uppercase tracking-tight">
                        {validationStatus}
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DATA */}
              <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center font-mono text-[10px] tracking-widest text-primary overflow-hidden">
                {data || "AWAITING INPUT..."}
              </div>

              {/* BUTTONS */}
              <div className="mt-2.5 space-y-2.5">

                {!isManual ? (
                  <Button
                    onClick={() =>
                      setIsManual(true)
                    }
                    className="w-full h-10 rounded-xl bg-white text-black hover:bg-gray-200 font-black text-xs transition-all duration-300"
                  >
                    <Keyboard className="mr-2 size-3.5" />
                    Manual Entry
                  </Button>
                ) : (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="space-y-2.5"
                  >
                    <Input
                      autoFocus
                      placeholder="Enter Ticket ID"
                      className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-center text-xs font-bold text-white focus-visible:ring-primary"
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
                      className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-black font-black text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                      <Zap className="mr-2 size-3.5" />
                      Validate Ticket
                    </Button>
                  </motion.div>
                )}

                {/* RESET */}
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="w-full h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 hover:text-white font-bold text-xs"
                >
                  <RefreshCw className="mr-2 size-3.5" />
                  Reset Scanner
                </Button>
              </div>
            </div>
          </motion.div>

          {/* FOOTER */}
          <p className="text-center text-[7px] uppercase tracking-[0.18em] text-gray-600 mt-3">
            Powered by VibePass
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;