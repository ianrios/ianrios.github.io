import { useEffect, useRef } from 'react';
import { useDesignVars } from '../../hooks/designVarsContext';

// Two independent grain effects, each its own editable token:
//  --texture-opacity    = a static film-grain layer over everything, with a
//                         subtle fast parallax against the pointer.
//  --texture-reactivity = a grain "blob" that EASES toward the pointer (lag
//                         in its CSS transition), intensifying grain nearby
//                         and relaxing where the pointer has left.
// `inline` renders static swatches for the admin demo.
export function TextureOverlay({ inline = false }: { inline?: boolean }) {
  const { vars } = useDesignVars();
  const reactivity = Number.parseFloat(vars['--texture-reactivity'] ?? '0');
  const staticRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inline) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * -16;
      const dy = (e.clientY / window.innerHeight - 0.5) * -16;
      staticRef.current?.style.setProperty(
        'transform',
        `translate(${dx}px, ${dy}px)`,
      );
      blobRef.current?.style.setProperty(
        'transform',
        `translate(${e.clientX}px, ${e.clientY}px)`,
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, [inline]);

  return (
    <>
      <div
        ref={staticRef}
        aria-hidden="true"
        className={[
          'skeu-texture-overlay',
          inline ? 'skeu-texture-overlay--inline' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {(inline || reactivity > 0) && (
        <div
          ref={blobRef}
          aria-hidden="true"
          className={[
            'skeu-texture-blob',
            inline ? 'skeu-texture-blob--inline' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}
    </>
  );
}
