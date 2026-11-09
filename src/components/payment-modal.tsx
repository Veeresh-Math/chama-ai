'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  milestone: {
    id: string;
    name: string;
    amount: string;
  };
  freelancerEmail: string;
  payoutBatchId: string;
}

export function PaymentModal({
  open,
  onClose,
  milestone,
  freelancerEmail,
  payoutBatchId,
}: PaymentModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className="text-2xl font-medium tracking-tight">
                  Milestone Settled
                </DialogTitle>
                <p className="text-black/50 text-sm">
                  Payment released via PayPal Payouts
                </p>
              </div>
            </div>
          </DialogHeader>
          <DialogContent className="p-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">
                  Milestone
                </p>
                <p className="text-lg font-medium text-black">{milestone.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">
                  Amount
                </p>
                <p className="text-lg font-medium text-black">
                  {formatCurrency(Number(milestone.amount))}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">
                  Paid To
                </p>
                <p className="text-lg font-medium text-black">{freelancerEmail}</p>
              </div>
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">
                  Batch ID
                </p>
                <p className="text-xs font-mono text-black/60 break-all">
                  {payoutBatchId}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-900">
                  Funds released to freelancer
                </p>
              </div>
              <p className="text-xs text-emerald-700/80">
                The milestone payment has been settled via PayPal Payouts. The freelancer
                should receive the funds shortly. A receipt has been recorded in the
                transaction ledger.
              </p>
            </div>
            <DialogFooter>
              <Button
                className="rounded-full px-6 h-11 bg-black text-white w-full"
                onClick={onClose}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
