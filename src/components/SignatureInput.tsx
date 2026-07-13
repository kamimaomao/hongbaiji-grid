import { MAX_SIGNATURE_LENGTH, getPosterTitle } from '../lib/selection';

interface SignatureInputProps {
  value: string;
  titleSuffix: string;
  onChange: (value: string) => void;
}

export function SignatureInput({ value, titleSuffix, onChange }: SignatureInputProps) {
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
        <span>{titleSuffix}</span>
      </div>
      <div className="signature-preview">
        <p>{getPosterTitle(value, titleSuffix)}</p>
        <span>{value.length}/{MAX_SIGNATURE_LENGTH}</span>
      </div>
    </section>
  );
}
