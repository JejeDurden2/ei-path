"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  DownloadSimple,
  FileText,
  Printer,
  Trash,
} from "@phosphor-icons/react";

import { MANUAL_FIELDS } from "@/lib/data";
import type { ManualField, ManualKey } from "@/lib/types";
import type { ManualPrefill } from "@/components/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ManualData = Partial<Record<ManualKey, string>>;

interface ManualProps {
  prefill: ManualPrefill | null;
}

const STORAGE_KEY = "eipath.manual";
const PREVIEW_ID = "manual-preview";
const FOOTER = "The EI Path · PMT";

const eyebrow =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground";

function read(): ManualData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as ManualData;
  } catch {
    return {};
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fileName(name: string | undefined): string {
  return `${name || "my"}-user-manual`
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/** Fields shown in the preview, the exports and the printed page. */
const SECTIONS: ManualField[] = MANUAL_FIELDS.filter(
  (field) => field.key !== "name",
);

function toText(data: ManualData): string {
  const lines: string[] = [`USER MANUAL: ${data.name ?? ""}`, ""];
  for (const field of SECTIONS) {
    lines.push(field.label.toUpperCase(), `  ${data[field.key] ?? ""}`, "");
  }
  lines.push(FOOTER);
  return lines.join("\n");
}

function toDocument(data: ManualData): string {
  const body = SECTIONS.filter((field) => (data[field.key] ?? "").trim())
    .map(
      (field) =>
        `<section><h2>${escapeHtml(field.label)}</h2><p>${escapeHtml(
          data[field.key] ?? "",
        )}</p></section>`,
    )
    .join("");
  return [
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
    `<title>User manual ${escapeHtml(data.name ?? "")}</title>`,
    "<style>body{font-family:ui-sans-serif,system-ui,sans-serif;max-width:720px;margin:48px auto;padding:0 24px;color:#111;line-height:1.6}",
    "h1{font-size:30px;margin:0 0 4px;letter-spacing:-.02em}.sub{color:#6b7280;font-size:14px;margin:0 0 28px}",
    "section{border-top:1px solid #e5e7eb;padding:14px 0}h2{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#6b7280;margin:0 0 6px}",
    "p{margin:0;font-size:15px;white-space:pre-wrap}footer{margin-top:32px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9ca3af}",
    "@media print{body{margin:0}}</style></head><body>",
    `<h1>${escapeHtml(data.name || "User manual")}</h1>`,
    '<p class="sub">User manual · how to work with me at my best</p>',
    body,
    `<footer>${FOOTER}</footer></body></html>`,
  ].join("");
}

export function Manual({ prefill }: ManualProps): React.JSX.Element {
  const [data, setData] = useState<ManualData>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setData(read());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Private browsing or a full quota, the form still works in memory.
    }
  }, [data, loaded]);

  useEffect(() => {
    if (!prefill) return;
    setData((prev) => {
      const next: ManualData = { ...prev };
      for (const field of MANUAL_FIELDS) {
        const incoming = prefill[field.key];
        if (!incoming) continue;
        if (field.kind === "select") {
          // The quiz sends the archetype name, the select holds the full option.
          const match = field.options?.find((option) =>
            option.startsWith(incoming),
          );
          if (match) next[field.key] = match;
        } else if (!(next[field.key] ?? "").trim()) {
          next[field.key] = incoming;
        }
      }
      return next;
    });
    setNote("Filled from your quiz result. Edit anything that does not ring true.");
  }, [prefill]);

  function setField(key: ManualKey, value: string): void {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function save(content: string, type: string, extension: string): void {
    const name = `${fileName(data.name)}${extension}`;
    try {
      const url = URL.createObjectURL(new Blob([content], { type }));
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.rel = "noopener";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      window.setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 2000);
      setNote(`Saved as ${name}. Check your downloads folder.`);
    } catch {
      setNote(
        "Your browser blocked the download here. Use Copy to clipboard instead.",
      );
    }
  }

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(toText(data));
      setNote("Copied. Paste it wherever you want it to live.");
    } catch {
      setNote(
        "Could not copy automatically. Select the text in the preview and copy it.",
      );
    }
  }

  function reset(): void {
    setData({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored, nothing to clear.
    }
    setNote("Cleared. Nothing left in this browser.");
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      <style>{`@media print {
        body * { visibility: hidden; }
        #${PREVIEW_ID}, #${PREVIEW_ID} * { visibility: visible; }
        #${PREVIEW_ID} { position: absolute; inset-block-start: 0; inset-inline-start: 0; width: 100%; }
      }`}</style>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        {MANUAL_FIELDS.map((field) => (
          <Field
            key={field.key}
            field={field}
            value={data[field.key] ?? ""}
            onChange={setField}
          />
        ))}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            size="lg"
            onClick={() => save(toDocument(data), "text/html", ".html")}
          >
            <DownloadSimple size={16} />
            Download my manual
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => save(toText(data), "text/plain", ".txt")}
          >
            <FileText size={16} />
            Download as text
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={() => void copy()}>
            <Copy size={16} />
            Copy to clipboard
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={() => window.print()}>
            <Printer size={16} />
            Print
          </Button>
          <Button type="button" size="lg" variant="ghost" onClick={reset}>
            <Trash size={16} />
            Reset
          </Button>
        </div>

        <p
          aria-live="polite"
          className={`font-mono text-[11px] leading-relaxed text-muted-foreground transition-opacity duration-(--duration-fast) ${
            note ? "opacity-100" : "opacity-0"
          }`}
        >
          {note || " "}
        </p>
      </form>

      <Card
        id={PREVIEW_ID}
        className="h-fit md:sticky md:top-8 [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]"
      >
        <CardContent>
          <span className={eyebrow}>User manual</span>
          <h3 className="pt-2 text-xl font-medium tracking-tight text-foreground">
            {data.name?.trim() || "Your name"}
          </h3>
        </CardContent>
        <CardContent className="space-y-4">
          {SECTIONS.map((field) => (
            <div key={field.key} className="border-t border-border pt-3">
              <span className={`${eyebrow} block pb-1`}>{field.label}</span>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {data[field.key]?.trim() || "..."}
              </p>
            </div>
          ))}
          <p className={`${eyebrow} pt-2`}>{FOOTER}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface FieldProps {
  field: ManualField;
  value: string;
  onChange: (key: ManualKey, value: string) => void;
}

function Field({ field, value, onChange }: FieldProps): React.JSX.Element {
  const id = `manual-${field.key}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {field.label}
      </label>
      {field.kind === "select" ? (
        <Select
          value={value.length > 0 ? value : null}
          onValueChange={(next) => onChange(field.key, next ?? "")}
        >
          <SelectTrigger id={id} size="default" className="h-9 w-full">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.kind === "textarea" ? (
        <Textarea
          id={id}
          rows={2}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      ) : (
        <Input
          id={id}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      )}
    </div>
  );
}
