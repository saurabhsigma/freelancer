"use client";

import { createInvoice, updateInvoiceStatus } from "@/server/actions/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useRef } from "react";

export function InvoicesTab({ projectId, invoices }: { projectId: string, invoices: any[] }) {
    const formRef = useRef<HTMLFormElement>(null);

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'paid': return <Badge variant="success">Paid</Badge>;
            case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
            default: return <Badge variant="secondary">Sent</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {invoices.map((invoice) => (
                    <Card key={invoice._id}>
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold">{formatCurrency(invoice.amount)}</span>
                                    <StatusBadge status={invoice.status} />
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Due {invoice.dueDate ? formatDate(invoice.dueDate) : "No due date"}
                                </p>
                                {invoice.notes && <p className="text-xs text-slate-500 mt-1">{invoice.notes}</p>}
                            </div>

                            <div className="flex gap-2">
                                {invoice.status !== 'paid' && (
                                    <button
                                        onClick={() => updateInvoiceStatus(invoice._id, projectId, 'paid')}
                                        className="text-xs font-medium text-emerald-600 hover:text-emerald-800 px-3 py-1 bg-emerald-50 rounded-md"
                                    >
                                        Mark Paid
                                    </button>
                                )}
                                {invoice.status === 'sent' && (
                                    <button
                                        onClick={() => updateInvoiceStatus(invoice._id, projectId, 'overdue')}
                                        className="text-xs font-medium text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 rounded-md"
                                    >
                                        Mark Overdue
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-dashed bg-slate-50/50">
                <CardContent className="p-4">
                    <form
                        ref={formRef}
                        action={async (formData) => {
                            await createInvoice(formData);
                            formRef.current?.reset();
                        }}
                        className="flex flex-col sm:flex-row gap-4 items-end"
                    >
                        <input type="hidden" name="projectId" value={projectId} />
                        <div className="w-full sm:w-32 space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Amount</label>
                            <Input name="amount" type="number" placeholder="0.00" required />
                        </div>
                        <div className="w-full sm:w-40 space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                            <Input name="dueDate" type="date" />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Notes</label>
                            <Input name="notes" placeholder="Invoice #001 - Initial Deposit" />
                        </div>
                        <Button type="submit" size="sm" className="w-full sm:w-auto mb-[2px]">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Invoice
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
