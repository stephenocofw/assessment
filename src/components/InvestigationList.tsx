import { useState, useMemo } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, ArrowUpDown, ChevronDown, ChevronUp, FileText, CheckCircle2, Clock, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { Input } from './ui/input';

type SortKey = 'date' | 'title' | 'status';
type SortDirection = 'asc' | 'desc';

export function InvestigationList() {
    const { incidents, investigations } = useIncidents();
    const navigate = useNavigate();

    // State for filtering and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending Start' | 'In Progress' | 'Completed'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: 'desc' });

    // Combine data for the table
    const tableData = useMemo(() => {
        return incidents
            .filter(i => i.needsInvestigation || i.status === 'Investigating' || investigations.some(inv => inv.incidentId === i.id))
            .map(incident => {
                const inv = investigations.find(i => i.incidentId === incident.id);
                let statusLabel = 'Pending Start';
                let statusColor = 'text-amber-600 bg-amber-50';
                let StatusIcon = Clock;

                if (inv) {
                    if (inv.status === 'Submitted') {
                        statusLabel = 'Completed';
                        statusColor = 'text-emerald-600 bg-emerald-50';
                        StatusIcon = CheckCircle2;
                    } else {
                        statusLabel = 'In Progress';
                        statusColor = 'text-blue-600 bg-blue-50';
                        StatusIcon = FileText;
                    }
                }

                return {
                    id: incident.id,
                    date: incident.date,
                    title: incident.title,
                    description: incident.whatHappened,
                    status: statusLabel,
                    statusColor,
                    StatusIcon
                };
            });
    }, [incidents, investigations]);

    // Apply Filters and Sort
    const filteredAndSortedData = useMemo(() => {
        let data = [...tableData];

        // 1. Filter by Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.title.toLowerCase().includes(lowerTerm) ||
                item.description.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Filter by Status
        if (statusFilter !== 'All') {
            data = data.filter(item => item.status === statusFilter);
        }

        // 3. Sort
        data.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return data;
    }, [tableData, searchTerm, statusFilter, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
        return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Investigations</h2>
                    <p className="text-muted-foreground">Manage ongoing systemic assessments.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search investigations..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 bg-muted/50 p-1 rounded-lg self-start">
                            {(['All', 'Pending Start', 'In Progress', 'Completed'] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={clsx(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                        statusFilter === filter
                                            ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                                            : "text-muted-foreground hover:bg-background/50"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center hover:text-foreground transition-colors"
                                            onClick={() => handleSort('date')}
                                        >
                                            Date {getSortIcon('date')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[40%]">
                                        <button
                                            className="flex items-center hover:text-foreground transition-colors"
                                            onClick={() => handleSort('title')}
                                        >
                                            Incident {getSortIcon('title')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center hover:text-foreground transition-colors"
                                            onClick={() => handleSort('status')}
                                        >
                                            Status {getSortIcon('status')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredAndSortedData.length > 0 ? (
                                    filteredAndSortedData.map((item) => {
                                        const StatusIcon = item.StatusIcon;
                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer group"
                                                onClick={() => navigate(`/investigations/${item.id}`)}
                                            >
                                                <td className="p-4 align-middle">
                                                    <div className="font-medium whitespace-nowrap text-muted-foreground">{item.date}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="font-medium">{item.title}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", item.statusColor)}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.status === 'Completed' ? 'View' : 'Open'}
                                                        <ArrowRight className="ml-2 w-3 h-3" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="h-24 text-center align-middle text-muted-foreground">
                                            No investigations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t text-xs text-muted-foreground">
                        Showing {filteredAndSortedData.length} investigations.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
