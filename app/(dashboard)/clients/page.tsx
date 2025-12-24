import { getClients } from "@/server/actions/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Clients</h2>
                    <p className="text-muted-foreground mt-1 dark:text-slate-400">
                        Manage your customer relationships.
                    </p>
                </div>
                <Link href="/clients/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client
                    </Button>
                </Link>
            </div>

            {clients.length === 0 ? (
                <Card className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-slate-100 p-3 mb-4">
                        <Plus className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No clients yet</h3>
                    <p className="max-w-sm mt-1 text-sm text-muted-foreground mb-6">
                        Get started by adding your first client. You can then attach projects to them.
                    </p>
                    <Link href="/clients/new">
                        <Button>Add Client</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clients.map((client: any) => (
                        <Link href={`/clients/${client._id}`} key={client._id}>
                            <Card className="h-full hover:border-slate-400 transition-colors cursor-pointer group">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200">{client.name}</h3>
                                            {client.company && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{client.company}</p>}
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                            {client.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm text-muted-foreground dark:text-slate-400">
                                        {client.email && <p>{client.email}</p>}
                                        {client.phone && <p>{client.phone}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
