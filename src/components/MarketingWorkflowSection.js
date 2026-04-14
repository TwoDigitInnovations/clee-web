
import { Mail, MessageSquare, Phone } from "lucide-react";

const STEP_ICONS = {
  mail:  { icon: Mail,          bg: "bg-blue-100",    color: "text-blue-600"   },
  sms:   { icon: MessageSquare, bg: "bg-violet-100",  color: "text-violet-600" },
  phone: { icon: Phone,         bg: "bg-emerald-100", color: "text-emerald-600" },
};

const BADGE_STYLES = {
  Instant:  "bg-slate-100 text-slate-600",
  "+3 Days": "bg-blue-50  text-custom-blue border border-blue-200",
  "+7 Days": "bg-blue-50  text-custom-blue border border-blue-200",
};

export default function MarketingWorkflowSection({ steps }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">Marketing Automation Workflow</h3>
      </div>

      <div className="px-6 py-2 divide-y divide-slate-100">
        {steps.map((step) => {
          const cfg  = STEP_ICONS[step.icon] ?? STEP_ICONS.mail;
          const Icon = cfg.icon;
          return (
            <div key={step.id} className="flex items-center gap-4 py-4">
              <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{step.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{step.trigger}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${BADGE_STYLES[step.badge] ?? "bg-slate-100 text-slate-600"}`}>
                {step.badge}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}