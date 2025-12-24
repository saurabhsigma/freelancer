import { getSession } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/models/Invoice";
// Ensure related models are registered with mongoose before populating refs
import "@/models/Project";
import "@/models/Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

async function getAllInvoices() {
    const session = await getSession();
    if (!session?.user?.id) return [];

    await connectToDatabase();
    // Populate project to get client name possibly, or just project title
    const invoices = await Invoice.find({})
        .populate({
            path: 'projectId',
            match: { userId: session.user.id }, // Security: only user's projects
            populate: { path: 'clientId', select: 'name' },
            select: 'title clientId'
        })
        .sort({ dueDate: 1 });

    // Filter out invoices where project is null (mismatch user)
    return JSON.parse(JSON.stringify(invoices.filter((i: any) => i.projectId)));
}

export default async function InvoicesPage() {
    const invoices = await getAllInvoices();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Invoices</h2>
                <p className="text-muted-foreground mt-1 dark:text-slate-400">
                    Track all your payments across projects.
                </p>
            </div>

            <div className="space-y-4">
                {invoices.length === 0 ? (
                    <Card className="py-12 text-center text-muted-foreground">
                        No invoices found. Create them inside a Project.
                    </Card>
                ) : (
                    invoices.map((invoice: any) => (
                        <Link href={`/projects/${invoice.projectId._id}`} key={invoice._id}>
                            <Card className="hover:border-slate-400 transition-colors cursor-pointer group">
                                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(invoice.amount)}</span>
                                            <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="font-medium text-slate-900 dark:text-slate-200">{invoice.projectId.title}</span>
                                            {invoice.projectId.clientId && (
                                                <span> • {invoice.projectId.clientId.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground text-right">
                                        {invoice.dueDate && <p>Due {formatDate(invoice.dueDate)}</p>}
                                        {invoice.notes && <p className="text-xs mt-1 text-slate-400">{invoice.notes}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
