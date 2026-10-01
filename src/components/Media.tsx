"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/content/types";

type Props = {
  media: Media;
  className?: string;
  /** Show the caption under the frame. */
  caption?: boolean;
  /** Load eagerly (above the fold). */
  priority?: boolean;
  /** Use object-fit: contain (charts, screenshots that must not be cropped). */
  contain?: boolean;
  /** Override the frame's aspect ratio, e.g. "16 / 9". Defaults to the intrinsic ratio. */
  ratio?: string;
};

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MediaFigure({
  media,
  className = "",
  caption = true,
  priority,
  contain,
  ratio,
}: Props) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fail = useCallback(() => setFailed(true), []);
  // An image can fail before hydration attaches onError; check its state once on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const aspect = ratio ?? `${media.width} / ${media.height}`;
  const cap = media.caption;

  return (
    <figure className={`media ${className}`}>
      <div
        className={`media__frame${contain ? " media__frame--contain" : ""}`}
        style={{ aspectRatio: aspect }}
      >
        {failed ? (
          <div className="media__fail" role="img" aria-label={media.alt}>
            <span>
              Media failed to load.
              <br />
              {media.alt}
            </span>
          </div>
        ) : media.kind === "video" ? (
          <AutoVideo media={media} onFail={fail} priority={priority} />
        ) : (
          // Plain <img>: the site is a static export, images are pre-optimised WebP at fixed sizes.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : undefined}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {caption && cap ? <figcaption>{cap}</figcaption> : null}
    </figure>
  );
}

/** Muted, looping, inline video that only downloads and plays while on screen.
 *  With prefers-reduced-motion it stays on its poster until the visitor presses play. */
export function AutoVideo({
  media,
  onFail,
  priority,
  controls = true,
}: {
  media: Media;
  onFail?: () => void;
  priority?: boolean;
  controls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState<string | undefined>(
    priority ? media.src : undefined,
  );
  const userPaused = useRef(false);
  const visible = useRef(false);
  const playWhenReady = () => {
    const el = ref.current;
    if (el && visible.current && !reducedMotion() && !userPaused.current)
      el.play().catch(() => {});
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // A server-rendered source may already have failed before hydration attached onError.
    if (el.error) onFail?.();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setSrc(media.src);
          if (el.readyState >= 2 && !reducedMotion() && !userPaused.current)
            el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [media.src, onFail]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    setSrc(media.src);
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  const fullscreen = () => {
    const el = ref.current as
      (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else el.webkitEnterFullscreen?.();
  };

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={media.poster}
        muted
        loop
        playsInline
        preload={src ? "auto" : "none"}
        aria-label={media.alt}
        width={media.width}
        height={media.height}
        onPlay={() => setPlaying(true)}
        onLoadedData={playWhenReady}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          if (src) onFail?.();
        }}
      />
      {controls ? (
        <div className="vctl">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={fullscreen}
            aria-label="View video fullscreen"
          >
            Full
          </button>
        </div>
      ) : null}
    </>
  );
}
