import { Plus, Trash2 } from "lucide-react";
import { useData } from "@/context/data";
import { useEdit } from "@/context/edit";
import { EditImage } from "@/components/admin/Editable";
import { CustomAd } from "@/components/SiteAds";
import { AdSlot } from "@/components/AdSlot";

/** Admin-managed extra ad slots. Visitors see the configured ads (or the demo
 *  300x100 placeholder if none). In edit mode each ad is replaceable, has a link
 *  field, and there's an "Add ad" button. */
export function AdRegion() {
  const { overrides } = useData();
  const { editing, addItem, removeItem, onText } = useEdit();
  const extra = overrides.ads?.extra || [];

  if (!editing && extra.length === 0) return <AdSlot size="300x100" />;

  return (
    <div className="space-y-3">
      {extra.map((ad, i) => (
        <div key={i} className="relative">
          <EditImage target={{ kind: "adExtra", index: i }} className="block">
            {ad.img ? <CustomAd ad={ad} /> : <AdSlot size="300x250" />}
          </EditImage>
          {editing && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <input value={ad.link} placeholder="Link (optional)"
                onChange={(e) => onText({ kind: "adExtraLink", index: i }, e.target.value)}
                className="flex-1 text-xs rounded-lg border border-border px-2 py-1 bg-white" />
              <button onClick={() => removeItem("ad", i)} title="Delete ad"
                className="h-7 w-7 grid place-items-center rounded-lg text-live hover:bg-live/10 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          )}
        </div>
      ))}
      {editing && (
        <button onClick={() => addItem("ad")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-pitch font-display font-bold uppercase tracking-wider text-xs border-2 border-dashed border-pitch/40 hover:bg-accent/40">
          <Plus className="h-4 w-4" /> Add ad
        </button>
      )}
    </div>
  );
}
