import { toPng } from 'html-to-image';
import { useState } from 'react';
import { useInput } from './useInput';

export default function App() {
  const [previews, setPreviews] = useState<string[]>([]);

  const { value, onChangeInput, resetValue } = useInput({ minLength: 1 });
  const {
    value: descValue,
    onChangeInput: onChangeDesc,
    resetValue: resetDesc,
  } = useInput({
    minLength: 1,
    maxLength: 10,
  });

  const getScreenShot = async () => {
    const root = document.getElementById('preview');
    if (previews.length >= 9) return;
    if (root) {
      try {
        const url = await toPng(root, { canvasWidth: 120, canvasHeight: 120 });
        setPreviews((prev) => [...prev, url]);
        resetValue();
        resetDesc();
      } catch {
        alert('실패했습니다 ㅠㅠ');
      }
    }
  };

  return (
    <div className="App">
      <main>
        <h1>html to image demo</h1>
        <div className="col">
          <div className="preview" id="preview">
            <div className="title">{value}</div>
            <div className="desc">{descValue}</div>
          </div>
          <div className="col">
            <label>
              플랜 이름
              <input value={value} onChange={onChangeInput} />
            </label>

            <label>
              플랜 설명
              <input value={descValue} onChange={onChangeDesc} />
            </label>
          </div>

          <button onClick={getScreenShot}>Get Screenshot</button>
        </div>

        <div className="preview-group" id="preview-group">
          {previews.map((preview) => (
            <img src={preview} alt="preview" />
          ))}
        </div>
      </main>
    </div>
  );
}
