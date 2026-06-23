interface GeneratePanelProps {
  complete: boolean;
  imageUrl: string | null;
  onGenerate: () => void;
}

export function GeneratePanel({ complete, imageUrl, onGenerate }: GeneratePanelProps) {
  return (
    <section className="generate-panel">
      <button type="button" disabled={!complete} onClick={onGenerate}>
        {complete ? '生成分享图' : '选满 9 个后生成'}
      </button>
      {imageUrl && (
        <a className="download-link" href={imageUrl} download="fc-nine-grid.png">
          下载图片
        </a>
      )}
    </section>
  );
}
