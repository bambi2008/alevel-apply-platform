"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { supportsDirectCameraCapture } from "@/lib/device-capabilities";
import {
  MAX_ANSWER_IMAGE_BYTES,
  MAX_ANSWER_IMAGES_PER_PART,
  type AnswerImageRef,
} from "@/lib/tests/answer-images";

export { hasAnswerContent } from "@/lib/tests/answer-images";
export type { AnswerImageRef } from "@/lib/tests/answer-images";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "请先登录，再上传答题照片。",
  unsupported_type: "仅支持 JPG、PNG 或 WebP 图片。",
  signature_mismatch: "图片内容与文件格式不一致，请重新拍照。",
  invalid_image: "图片无法读取，请重新拍照或更换文件。",
  too_large: "单张图片不能超过 8 MB。",
};

function uploadMessage(status: number, error?: string) {
  if (status === 401) return ERROR_MESSAGES.unauthenticated;
  return ERROR_MESSAGES[error ?? ""] ?? "上传失败，请检查网络后重试。";
}

const subscribeToStaticDeviceCapability = () => () => {};

function getDirectCameraCaptureSnapshot() {
  return supportsDirectCameraCapture({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  });
}

function useDirectCameraCapture() {
  return useSyncExternalStore(
    subscribeToStaticDeviceCapability,
    getDirectCameraCaptureSnapshot,
    () => false,
  );
}

export function HandwrittenAnswerInput({
  value,
  onChange,
  images,
  onImagesChange,
  contextKey,
  disabled = false,
  rows = 3,
  placeholder = "补充必要说明（可选）",
}: {
  value: string;
  onChange: (value: string) => void;
  images: AnswerImageRef[];
  onImagesChange: (images: AnswerImageRef[]) => void;
  contextKey: string;
  disabled?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canCaptureDirectly = useDirectCameraCapture();

  const upload = async (files: FileList | null) => {
    if (!files?.length || disabled || uploading) return;
    const available = MAX_ANSWER_IMAGES_PER_PART - images.length;
    if (available <= 0) {
      setError(`每个小问最多上传 ${MAX_ANSWER_IMAGES_PER_PART} 张。`);
      return;
    }
    setUploading(true);
    setError(null);
    const next = [...images];
    try {
      for (const file of Array.from(files).slice(0, available)) {
        if (file.size > MAX_ANSWER_IMAGE_BYTES) throw new Error(ERROR_MESSAGES.too_large);
        const form = new FormData();
        form.append("file", file);
        form.append("contextKey", contextKey);
        const response = await fetch("/api/answer-images", { method: "POST", body: form });
        const body = await response.json().catch(() => ({})) as { error?: string; image?: AnswerImageRef };
        if (!response.ok || !body.image) throw new Error(uploadMessage(response.status, body.error));
        next.push(body.image);
        onImagesChange([...next]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "上传失败，请重试。");
    } finally {
      setUploading(false);
      if (cameraRef.current) cameraRef.current.value = "";
      if (pickerRef.current) pickerRef.current.value = "";
    }
  };

  const remove = async (image: AnswerImageRef) => {
    if (disabled || removingId) return;
    setRemovingId(image.id);
    setError(null);
    try {
      const response = await fetch(`/api/answer-images/${image.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("删除失败，请重试。");
      onImagesChange(images.filter((item) => item.id !== image.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "删除失败，请重试。");
    } finally {
      setRemovingId(null);
    }
  };

  const canAdd = !disabled && !uploading && images.length < MAX_ANSWER_IMAGES_PER_PART;

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">上传手写答案</p>
          <p className="mt-0.5 text-xs text-[var(--ink-faint)]">
            {canCaptureDirectly
              ? "每个小问单独拍，保证字迹清楚、页面完整。"
              : "请选择已有答题图片，保证字迹清楚、页面完整。"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canCaptureDirectly && (
            <input
              ref={cameraRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="sr-only"
              aria-label="拍摄答题照片"
              disabled={!canAdd}
              onChange={(event) => void upload(event.target.files)}
            />
          )}
          <input
            ref={pickerRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            aria-label="选择答题图片"
            disabled={!canAdd}
            onChange={(event) => void upload(event.target.files)}
          />
          {canCaptureDirectly && (
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              disabled={!canAdd}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--indigo)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
              {uploading ? "上传中…" : "拍照"}
            </button>
          )}
          <button
            type="button"
            onClick={() => pickerRef.current?.click()}
            disabled={!canAdd}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
          >
            <ImagePlus className="size-4" />
            选图片
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="已上传的答题照片">
          {images.map((image, index) => (
            <figure key={image.id} className="relative overflow-hidden rounded-md border border-[var(--border)] bg-white">
              <Image
                src={image.url}
                alt={`答题照片 ${index + 1}`}
                width={image.width}
                height={image.height}
                unoptimized
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="flex items-center justify-between gap-2 px-2 py-1.5 text-xs text-[var(--ink-soft)]">
                <span>第 {index + 1} 张</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => void remove(image)}
                    disabled={removingId === image.id}
                    aria-label={`删除答题照片 ${index + 1}`}
                    className="inline-flex min-h-8 min-w-8 items-center justify-center rounded text-[var(--danger)] hover:bg-[var(--danger-bg)] disabled:opacity-50"
                  >
                    {removingId === image.id ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">补充文字（可选）</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full resize-y rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-[var(--indigo)] focus:ring-2 focus:ring-[color:var(--indigo)]/10 disabled:opacity-60"
        />
      </label>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[var(--ink-faint)]">支持 JPG、PNG、WebP；单张不超过 8 MB，最多 {MAX_ANSWER_IMAGES_PER_PART} 张。</span>
        {images.length > 0 && <span className="font-semibold text-[var(--success)]">已上传 {images.length} 张</span>}
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
}
