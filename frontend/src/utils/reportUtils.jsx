import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { months } from "../constants/months";
export const getCategoryColor = (category) => {
    const colors = {
        needs: "bg-blue-500",
        wants: "bg-purple-500",
        culture: "bg-green-500",
        unexpected: "bg-orange-500"
    };
    return colors[category] || "bg-gray-500";
};

export const getCategoryBgColor = (category) => {
    const colors = {
        needs: "bg-blue-50",
        wants: "bg-purple-50",
        culture: "bg-green-50",
        unexpected: "bg-orange-50"
    };
    return colors[category] || "bg-gray-50";
};

export const handleDownloadPDF = async (ref, selectedMonth) => {
    if (!ref.current) return;
    const element = ref.current;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    const scale = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const imgWidth = imgProps.width * scale;
    const imgHeight = imgProps.height * scale;
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    pdf.save(`Monthly_Report_${months[selectedMonth]}.pdf`);
};
