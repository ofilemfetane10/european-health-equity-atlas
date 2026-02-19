import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PDFDownloadProps {
  reportType: "ehei" | "comparison";
  fileName?: string;
  htmlContent: string;
}

export function PDFDownload({ reportType, fileName = "report", htmlContent }: PDFDownloadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = async () => {
    setIsLoading(true);
    try {
      // Create a blob from the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={downloadPDF}
      disabled={isLoading}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isLoading ? "Generating..." : "Download PDF Report"}
    </Button>
  );
}
