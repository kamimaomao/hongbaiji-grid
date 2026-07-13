interface GeneratePanelProps {
  complete: boolean;
  imageUrl: string | null;
  downloadName: string;
  onGenerate: () => void;
}

export function GeneratePanel({ complete, imageUrl, downloadName, onGenerate }: GeneratePanelProps) {
  return (
    <section className="generate-panel" aria-label="生成分享图">
      <div className="generate-actions">
        <button type="button" disabled={!complete} onClick={onGenerate}>
          {complete ? (imageUrl ? '重新生成' : '生成分享图') : '选满 9 个后生成'}
        </button>
        {imageUrl && (
          <a className="download-link" href={imageUrl} download={downloadName}>
            保存图片
          </a>
        )}
      </div>
      {imageUrl && (
        <figure className="poster-preview">
          <img src={imageUrl} alt="刚刚生成的九宫格分享图预览" />
          <figcaption>长按图片也可以保存到手机</figcaption>
        </figure>
      )}
    </section>
  );
}
