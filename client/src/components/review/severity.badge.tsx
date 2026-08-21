import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getSeverityColor } from "@/libraries/utils";
import { SeverityLevel } from "@/types";

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

const severityConfig = {
  critical: { icon: AlertTriangle, label: "Critical" },
  warning: { icon: AlertCircle, label: "Warning" },
  info: { icon: Info, label: "Info" },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge className={getSeverityColor(severity)}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}




