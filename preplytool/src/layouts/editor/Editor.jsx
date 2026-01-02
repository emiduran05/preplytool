// src/layouts/editor/Editor.jsx
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

let Quill;
let ImageResize;

// ✅ Registramos ImageResize SOLO en cliente
if (typeof window !== "undefined") {
  Quill = require("quill");
  ImageResize = require("quill-image-resize-module-react").default;
  Quill.register("modules/imageResize", ImageResize);
}

export default function QuillEditor({ value = "", onSave }) {
  const quillRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value);

  // Tabla
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableWidth, setTableWidth] = useState("100%");
  const [centered, setCentered] = useState(true);
  const [borders, setBorders] = useState(true);

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const getEditor = () => quillRef.current?.getEditor();

  // Construye tabla HTML manualmente
  const buildTableHTML = () => {
    const borderStyle = borders ? "1px solid #ccc" : "none";
    const marginStyle = centered ? "0 auto" : "0";
    let html = `<table style="width:${tableWidth}; border:${borderStyle}; border-collapse:collapse; margin:${marginStyle};">`;
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        html += `<td style="border:${borderStyle}; padding:6px;">Fila ${r + 1}, Col ${c + 1}</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    return html;
  };

  const handleInsertTable = () => {
    const editor = getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    editor.clipboard.dangerouslyPasteHTML(range?.index ?? 0, buildTableHTML());
  };

  const applyTableStyles = () => {
    const editor = getEditor();
    if (!editor) return;
    editor.root.querySelectorAll("table").forEach((t) => {
      t.style.width = tableWidth;
      t.style.margin = centered ? "0 auto" : "0";
      t.style.borderCollapse = "collapse";
      t.style.border = borders ? "1px solid #ccc" : "none";
      t.querySelectorAll("td, th").forEach((cell) => {
        cell.style.border = borders ? "1px solid #ccc" : "none";
        cell.style.padding = "6px";
      });
    });
  };

  const handleInsertImage = () => {
    const url = prompt("URL de la imagen:");
    if (!url) return;
    const editor = getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    editor.insertEmbed(range?.index ?? 0, "image", url);
  };

  const handleSave = () => {
    const editor = getEditor();
    if (!editor) return;
    onSave?.(editor.root.innerHTML);
  };

  // ⚡ Solo pasar Quill si estamos en cliente
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
    ...(typeof window !== "undefined" && Quill
      ? { imageResize: { parchment: Quill.import("parchment") } }
      : {}),
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleInsertImage}>Insertar imagen</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <label>
          Filas:
          <input type="number" value={rows} min={1} onChange={(e) => setRows(+e.target.value)} />
        </label>

        <label>
          Columnas:
          <input type="number" value={cols} min={1} onChange={(e) => setCols(+e.target.value)} />
        </label>

        <label>
          Ancho:
          <input value={tableWidth} onChange={(e) => setTableWidth(e.target.value)} />
        </label>

        <label>
          Centrar
          <input type="checkbox" checked={centered} onChange={(e) => setCentered(e.target.checked)} />
        </label>

        <label>
          Bordes
          <input type="checkbox" checked={borders} onChange={(e) => setBorders(e.target.checked)} />
        </label>

        <button onClick={handleInsertTable}>Insertar tabla</button>
        <button onClick={applyTableStyles}>Aplicar estilos</button>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={internalValue}
        onChange={setInternalValue}
        modules={modules}
        style={{ height: 320, marginBottom: 60 }}
      />

      <button
        onClick={handleSave}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        Guardar
      </button>
    </div>
  );
}
