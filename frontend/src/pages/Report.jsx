import React, { useState, useEffect, useRef } from "react";
import { getReport } from "../services/ReportService";
import { handleDownloadPDF } from "../utils/reportUtils";

import ReportHeader from "../components/report/ReportHeader";
import SummaryCards from "../components/report/SummaryCards";
import SpendingDistribution from "../components/report/SpendingDistribution";
import BarChartView from "../components/report/BarChartView";
import TopExpenses from "../components/report/TopExpenses";
import CategoryComparison from "../components/report/CategoryComparison";
import InvestmentGrowth from "../components/report/InvestmentGrowth";
import EmergencyPreparedness from "../components/report/EmergencyPreparedness";

export default function ReportPage() {
    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef();

    useEffect(() => {
        async function fetchReport(month = null) {
            setLoading(true);
            try {
                const res = await getReport(month);
                if (res.success) setReportData(res.data);
                else console.error(res.message);
            } catch (err) {
                console.error("Error fetching report:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchReport(selectedMonth === 0 ? null : selectedMonth);
    }, [selectedMonth]);

    if (loading) return <p>Loading...</p>;
    if (!reportData) return <p>No report data available.</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <ReportHeader
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                onExport={() => handleDownloadPDF(reportRef, selectedMonth)}
            />

            <div ref={reportRef} className="max-w-7xl mx-auto">
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
                    <SummaryCards reportData={reportData} />
                    <div className="grid grid-cols-2 gap-6 my-6">
                        <SpendingDistribution reportData={reportData} />
                        <BarChartView reportData={reportData} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <TopExpenses reportData={reportData} />
                        <CategoryComparison reportData={reportData} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <InvestmentGrowth reportData={reportData} />
                        <EmergencyPreparedness reportData={reportData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
