import { useState, useRef, useEffect } from "react";
import {
  CheckSquare,
  List,
  Calendar,
  PenTool,
  Heading,
  AlignLeft,
  MessageSquare,
  FileSignature,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Baby,
  Users,
  Share2,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  GripVertical,
} from "lucide-react";

const STANDARD_ELEMENTS = [
  {
    id: "checkbox",
    label: "Checkbox",
    desc: "Ask to confirm something",
    icon: CheckSquare,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "choose_list",
    label: "Choose from list",
    desc: "A list of options that can be ticked",
    icon: List,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "date",
    label: "Date",
    desc: "Ask for a date",
    icon: Calendar,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "drawing",
    label: "Drawing",
    desc: "Draw on an image or a photo",
    icon: PenTool,
    color: "#34d399",
    bg: "#ecfdf5",
  },
  {
    id: "heading",
    label: "Heading",
    desc: "Create a heading for a section",
    icon: Heading,
    color: "#fbbf24",
    bg: "#fffbeb",
  },
  {
    id: "long_answer",
    label: "Long answer",
    desc: "Ask a question with a longer answer",
    icon: AlignLeft,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "short_answer",
    label: "Short answer",
    desc: "Ask a question with a short answer",
    icon: MessageSquare,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "signature",
    label: "Signature",
    desc: "Ask for a signature",
    icon: FileSignature,
    color: "#34d399",
    bg: "#ecfdf5",
  },
  {
    id: "text_block",
    label: "Text block",
    desc: "Add a paragraph without a question",
    icon: FileText,
    color: "#fbbf24",
    bg: "#fffbeb",
  },
];

const CLIENT_DETAIL_ELEMENTS = [
  {
    id: "email_marketing",
    label: "Accepts email marketing",
    desc: "Clients can opt in to marketing",
    icon: Mail,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "sms_marketing",
    label: "Accepts SMS/text marketing",
    desc: "Clients can opt in to marketing",
    icon: MessageSquare,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "company",
    label: "Company",
    desc: "Confirm a clients company",
    icon: Briefcase,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "dob",
    label: "Date of birth",
    desc: "Confirm a clients birth date",
    icon: Baby,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "gender",
    label: "Gender",
    desc: "Confirm a clients gender",
    icon: Users,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "occupation",
    label: "Occupation",
    desc: "Confirm a clients occupation",
    icon: Briefcase,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "physical_address",
    label: "Physical address",
    desc: "Confirm a clients physical address",
    icon: MapPin,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "postal_address",
    label: "Postal address",
    desc: "Confirm a clients postal address",
    icon: MapPin,
    color: "#818cf8",
    bg: "#eef2ff",
  },
  {
    id: "referred_by",
    label: "Referred by",
    desc: "Where did they hear of you",
    icon: Share2,
    color: "#f87171",
    bg: "#fff1f2",
  },
  {
    id: "telephone",
    label: "Telephone number",
    desc: "Confirm a clients telephone number",
    icon: Phone,
    color: "#818cf8",
    bg: "#eef2ff",
  },
];

let uid = 0;
const nextId = () => `item_${++uid}_${Date.now()}`;

function ThreeDotMenu({ onEdit, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-slate-200 rounded-xl shadow-xl w-36 py-1 overflow-hidden">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit2 size={14} className="text-slate-400" /> Edit
          </button>
          <button
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

function FormFieldCard({ item, onEdit, onRemove }) {
  const Icon = item.icon;
  return (
    <div className="group flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: item.bg }}
      >
        <Icon size={15} style={{ color: item.color }} />
      </div> */}
      <div className="flex-1 min-w-0 py-1 ">
        <p className="text-sm font-semibold text-slate-800 leading-tight">
          {item.label}
        </p>
        <input
          value={item.desc}
          placeholder={item.desc}
          className="text-[13px] mt-2 text-slate-400 rounded-md mt-0.5 truncate w-full border border-gray-100 py-2 px-4 "
        />
      </div>
      <ThreeDotMenu onEdit={onEdit} onRemove={() => onRemove(item.uid)} />
    </div>
  );
}

function SidebarRow({ el, onClick, disabled }) {
  const Icon = el.icon;
  return (
    <button
      onClick={() => !disabled && onClick(el)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-150 text-left
        ${
          disabled
            ? "border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed"
            : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm cursor-pointer active:scale-[0.98]"
        }`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: el.bg }}
      >
        <Icon size={15} style={{ color: el.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 leading-tight truncate">
          {el.label}
        </p>
        <p className="text-xs text-slate-400 truncate">{el.desc}</p>
      </div>
      {!disabled && <Plus size={14} className="text-slate-300 flex-shrink-0" />}
    </button>
  );
}

function EditModal({ item, onClose, onSave }) {
  const [label, setLabel] = useState(item.label);
  const [desc, setDesc] = useState(item.desc);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800">{label} editor</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Label
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(item.uid, label, desc);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-custom-blue text-white text-sm font-medium rounded-lg hover:bg-custom-blue transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function DropZone({ onAdd }) {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHovering(true);
      }}
      onDragLeave={() => setHovering(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHovering(false);
      }}
      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 gap-2 transition-all duration-200 cursor-pointer
        ${hovering ? "border-indigo-400 bg-indigo-50/60" : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${hovering ? "bg-indigo-100" : "bg-white border border-slate-200"}`}
      >
        <Plus
          size={18}
          className={hovering ? "text-custom-blue" : "text-slate-400"}
        />
      </div>
      <p
        className={`text-sm font-medium ${hovering ? "text-custom-blue" : "text-slate-400"}`}
      >
        Drop new elements here
      </p>
    </div>
  );
}

export default function AddTemplate() {
  const [tab, setTab] = useState("standard"); // "standard" | "client"
  const [search, setSearch] = useState("");
  const [formItems, setFormItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const addedClientIds = new Set(
    formItems.filter((i) => i.isClientDetail).map((i) => i.id),
  );

  const filtered = (
    tab === "standard" ? STANDARD_ELEMENTS : CLIENT_DETAIL_ELEMENTS
  ).filter(
    (el) =>
      el.label.toLowerCase().includes(search.toLowerCase()) ||
      el.desc.toLowerCase().includes(search.toLowerCase()),
  );

  const addElement = (el) => {
    setFormItems((prev) => [
      ...prev,
      { ...el, uid: nextId(), isClientDetail: tab === "client" },
    ]);
  };

  const removeItem = (uid) =>
    setFormItems((prev) => prev.filter((i) => i.uid !== uid));

  const saveEdit = (uid, label, desc) => {
    setFormItems((prev) =>
      prev.map((i) => (i.uid === uid ? { ...i, label, desc } : i)),
    );
  };

  return (
    <div className="min-h-screen bg-custom-gray">
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Client Intake Form
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
            Preview
          </button>
          <button className="px-5 py-2 bg-custom-blue text-white text-sm font-semibold rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">
            Save
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* Fixed fields */}
            <div className="space-y-4 mb-6">
              <div className="w-full group flex flex-col items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <label className="text-sm font-semibold text-slate-800 leading-tight ">
                  Full Name
                </label>

                <input
                  placeholder=" Client's legal name..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400 bg-slate-50"
                />
              </div>
              <div className="w-full group flex flex-col items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <label className="text-sm font-semibold text-slate-800 leading-tight">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="  example@domain.com"
                  className="text-[13px]  text-slate-400 rounded-md mt-0.5 truncate w-full border border-gray-100 py-2 px-4"
                />
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {formItems.map((item) => (
                <FormFieldCard
                  key={item.uid}
                  item={item}
                  onEdit={() => setEditingItem(item)}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <DropZone />
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="px-5 pt-5 pb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 mb-4">
                Add elements
              </h2>

              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {["standard", "client"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setSearch("");
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize
                      ${tab === t ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {t === "client" ? "Client details" : "Standard"}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <Search size={13} className="text-slate-400 flex-shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find elements..."
                  className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Element list */}
            <div className="p-3 space-y-2 overflow-y-auto max-h-[480px]">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No elements found
                </div>
              ) : (
                filtered.map((el) => (
                  <SidebarRow
                    key={el.id}
                    el={el}
                    onClick={addElement}
                    disabled={tab === "client" && addedClientIds.has(el.id)}
                  />
                ))
              )}
            </div>

            {tab === "standard" && (
              <div className="mx-3 mb-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-custom-blue text-xs">✦</span>
                  <span className="text-xs font-bold text-custom-blue">
                    Pro Tip
                  </span>
                </div>
                <p className="text-xs text-custom-blue leading-relaxed">
                  Combine "Signature" with "Date" elements for legally binding
                  consent forms.
                </p>
              </div>
            )}
            {tab === "client" && (
              <div className="mx-3 mb-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-amber-500 text-xs">✦</span>
                  <span className="text-xs font-bold text-amber-700">Note</span>
                </div>
                <p className="text-xs text-amber-600 leading-relaxed">
                  Each client detail can only be added once to the form.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
