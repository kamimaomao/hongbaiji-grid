import { DownloadSimple, X } from '@phosphor-icons/react';

interface PosterModalProps {
  imageUrl: string | null;
  downloadName: string;
  alt: string;
  onClose: () => void;
}

export function PosterModal({ imageUrl, downloadName, alt, onClose }: PosterModalProps) {
  if (!imageUrl) return null;

  return (
    <div className="poster-modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="poster-modal" role="dialog" aria-modal="true" aria-label="分享图预览">
        <button className="icon-button poster-modal-close" type="button" aria-label="关闭分享图" title="关闭" onClick={onClose}>
          <X size={22} weight="bold" />
        </button>
        <img src={imageUrl} alt={alt} />
        <a className="poster-download" href={imageUrl} download={downloadName}>
          <DownloadSimple size={20} weight="bold" />
          保存图片
        </a>
      </section>
    </div>
  );
}
