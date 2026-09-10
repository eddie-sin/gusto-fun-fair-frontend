"use client";
/* oxlint-disable react/react-compiler */

import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  RefreshCw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/app-provider";
import { MemoryGallery } from "@/components/memory-gallery";
import { apiRequest } from "@/lib/api";

type SnapContext = {
  status: string;
  allowance?: number;
  used?: number;
  remaining?: number;
  opensAt?: string | null;
  closesAt?: string | null;
};

const testHeaders = (key: string) => ({ "X-Memory-Booth-Test-Key": key });
const MAX_CAPTION_WORDS = 25;
const wordCount = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

export default function MemoryBoothTestPage() {
  const { auth, event } = useApp();
  const [key, setKey] = useState("");
  const [activeKey, setActiveKey] = useState("");
  const [context, setContext] = useState<SnapContext>();
  const [file, setFile] = useState<File>();
  const [caption, setCaption] = useState("");
  const [privilegeCode, setPrivilegeCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const savedKey = sessionStorage.getItem("memory-booth-test-key") || "";
    setKey(savedKey);
    setActiveKey(savedKey);
  }, []);

  const load = useCallback(async () => {
    if (!activeKey) return;
    setLoading(true);
    setError("");
    try {
      const windowResult = await apiRequest<{ snaps: SnapContext }>(
        "/memories/allowance",
        { token: auth?.token, headers: testHeaders(activeKey) },
      );
      setContext(windowResult.snaps);
      sessionStorage.setItem("memory-booth-test-key", activeKey);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The test connection could not be verified.",
      );
    } finally {
      setLoading(false);
    }
  }, [activeKey, auth?.token]);

  useEffect(() => {
    if (auth?.token && activeKey) void load();
  }, [activeKey, auth?.token, load]);

  const galleryHeaders = useMemo(
    () => (activeKey ? testHeaders(activeKey) : undefined),
    [activeKey],
  );

  const chooseFile = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const next = changeEvent.target.files?.[0];
    setFile(undefined);
    setError("");
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type))
      return setError("Choose a JPEG, PNG or WebP image.");
    if (next.size > 7 * 1024 * 1024)
      return setError("The photo must be 7 MB or smaller.");
    setFile(next);
  };

  const upload = async () => {
    if (!auth || !file || !activeKey) return;
    if (wordCount(caption) > MAX_CAPTION_WORDS)
      return setError(`Your caption must be ${MAX_CAPTION_WORDS} words or fewer.`);
    const body = new FormData();
    body.append("image", file);
    body.append("caption", caption.trim());
    if (privilegeCode.trim()) body.append("privilegeCode", privilegeCode.trim());
    setUploading(true);
    setError("");
    setMessage("");
    try {
      await apiRequest("/memories", {
        method: "POST",
        token: auth.token,
        headers: testHeaders(activeKey),
        body,
      });
      setFile(undefined);
      setCaption("");
      setPrivilegeCode("");
      setMessage("Uploaded to R2 and queued for Admin review.");
      await load();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The photo could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="feature-page feature-page--memories memory-test-page">
      <div className="site-container">
        <section className="memory-test-heading">
          <Camera aria-hidden="true" />
          <p className="eyebrow">Private event-day simulation</p>
          <h1>Memory Booth test</h1>
          <p>
            This page uses the real authenticated upload, private R2 storage,
            Admin review, public gallery, and reactions. The test key also
            bypasses the event-day check for reacting below, so you can try
            hearts today exactly as they will behave on the event day. It
            does not enable Memories for ordinary visitors.
          </p>
        </section>
        {!auth ? (
          <section className="paper-form memory-test-panel">
            <h2>Log in to test</h2>
            <p>The upload contract requires a normal customer account.</p>
            <Link href="/login" className="button">
              Log in
            </Link>
          </section>
        ) : (
          <div className="memory-test-grid">
            <section className="paper-form memory-test-panel">
              <div className="test-panel-title">
                <ShieldCheck aria-hidden="true" />
                <div>
                  <p className="eyebrow">Step 1</p>
                  <h2>Activate this test</h2>
                </div>
              </div>
              <p>
                Enter the key configured as{" "}
                <strong>MEMORY_BOOTH_TEST_KEY</strong> in the server
                environment.
              </p>
              <label className="field">
                <span>Private test key</span>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Paste the local test key"
                />
              </label>
              <button
                className="button button--full"
                onClick={() => setActiveKey(key)}
                disabled={!key || loading}
              >
                <RefreshCw size={17} />{" "}
                {loading ? "Checking…" : "Check test access"}
              </button>
              {context && (
                <div className="test-status">
                  <CheckCircle2 aria-hidden="true" />
                  <span>
                    <strong>Simulated event-day access is on</strong>
                    {context.remaining} of {context.allowance} uploads
                    remaining. The real event flag is currently{" "}
                    {event?.featureFlags?.memoriesEnabled
                      ? "enabled"
                      : "disabled"}
                    .
                  </span>
                </div>
              )}
            </section>
            <section className="paper-form memory-test-panel">
              <div className="test-panel-title">
                <Upload aria-hidden="true" />
                <div>
                  <p className="eyebrow">Step 2</p>
                  <h2>Send a real photo</h2>
                </div>
              </div>
              <label
                className={`upload-field ${!context || (context.used ?? 0) >= 2 ? "is-disabled" : ""}`}
              >
                <ImagePlus aria-hidden="true" />
                <strong>{file ? file.name : "Choose a test photo"}</strong>
                <span>JPEG, PNG or WebP · up to 7 MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={chooseFile}
                  disabled={!context || (context.used ?? 0) >= 2}
                />
              </label>
              <label className="field">
                <span>
                  Caption <small>optional</small>
                </span>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={300}
                  rows={3}
                  disabled={!context}
                  placeholder="What should Admin review?"
                />
                <small className={wordCount(caption) > MAX_CAPTION_WORDS ? "is-over-limit" : ""}>
                  {wordCount(caption)}/{MAX_CAPTION_WORDS} words
                </small>
              </label>
              {(context?.used ?? 0) >= 1 && (context?.used ?? 0) < 2 && (
                <label className="field">
                  <span>
                    Pre-order privilege code{" "}
                    <small>unlocks your second photo</small>
                  </span>
                  <input
                    value={privilegeCode}
                    onChange={(e) => setPrivilegeCode(e.target.value)}
                    placeholder="From any approved order — yours or a friend's"
                    disabled={!context}
                  />
                </label>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              {message && <output className="form-success">{message}</output>}
              <button
                className="button button--full"
                onClick={upload}
                disabled={
                  !context || !file || uploading || (context.used ?? 0) >= 2
                }
              >
                {uploading ? (
                  "Uploading…"
                ) : (
                  <>
                    <Upload size={17} /> Upload to real R2
                  </>
                )}
              </button>
            </section>
          </div>
        )}
        <section className="memory-test-checklist">
          <p className="eyebrow">Step 3 · verify the full loop</p>
          <ol>
            <li>
              Open Admin → Memories Feature and review the new pending photo.
            </li>
            <li>
              Approve it, then refresh this page to see the public gallery
              image.
            </li>
            <li>
              React to it below with a heart, exactly as visitors will on the
              event day. This uses the same component as the real{" "}
              <Link href="/memories">Memory Booth</Link> page.
            </li>
          </ol>
        </section>
        <section className="memory-test-gallery">
          <p className="eyebrow">Approved gallery from the real API</p>
          <MemoryGallery token={auth?.token} extraHeaders={galleryHeaders} />
        </section>
      </div>
    </main>
  );
}
