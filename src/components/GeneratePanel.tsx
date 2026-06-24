interface GeneratePanelProps {
  complete: boolean;
  imageUrl: string | null;
  downloadName: string;
  onGenerate: () => void;
}

export function GeneratePanel({ complete, imageUrl, downloadName, onGenerate }: GeneratePanelProps) {
  return (
    <section className="generate-panel">
      <button type="button" disabled={!complete} onClick={onGenerate}>
        {complete ? '生成分享图' : '选满 9 个后生成'}
      </button>
      {imageUrl && (
        <a className="download-link" href={imageUrl} download={downloadName}>
          下载图片
        </a>
      )}
    </section>
  );
}
