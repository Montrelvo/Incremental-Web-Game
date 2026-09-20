import { useEffect, useRef, type ReactNode } from 'react';
export default function Modal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} onCancel={close} aria-labelledby="modal-title" onClick={e => { if (e.target === ref.current) close(); }}>
    <div className="dialog-inner"><div className="dialog-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={close}>×</button></div>{children}</div>
  </dialog>;
}
