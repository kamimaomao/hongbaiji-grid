import { MAX_SIGNATURE_LENGTH, getPosterTitle } from '../lib/selection';

interface SignatureInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SignatureInput({ value, onChange }: SignatureInputProps) {
  return (
    <section className="signature-card">
      <label htmlFor="signature">署名</label>
      <div className="signature-row">
        <input
          id="signature"
          value={value}
          maxLength={MAX_SIGNATURE_LENGTH}
          placeholder="比如：阿明"
          onChange={(event) => onChange(event.target.value)}
        />
        <span>最喜欢的红白机游戏</span>
      </div>
      <p>{getPosterTitle(value)}</p>
    </section>
  );
}
