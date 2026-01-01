import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import QuillBetterTable from "quill-better-table";

// =====================
// REGISTROS
// =====================
Quill.register(
  {
    "modules/imageResize": ImageResize,
    "modules/better-table": QuillBetterTable
  },
  true
);

export default function QuillEditor({ value, onSave }) {
  const quillRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value || "");

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableWidth, setTableWidth] = useState("100%");

  // =====================
  // CARGA INICIAL
  // =====================
  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  // =====================
  // APLICAR ESTILOS TABLAS
  // =====================
  const applyTableStyles = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    editor.root.querySelectorAll("table").forEach((table) => {
      const width = table.dataset.width;
      const centered = table.dataset.centered;
      const borders = table.dataset.borders;

      if (width) table.style.width = width;
      if (centered === "true") table.style.margin = "0 auto";

      if (borders === "false") table.classList.add("no-borders");
      else table.classList.remove("no-borders");
    });
  };

  // =====================
  // REAPLICAR AL CAMBIAR
  // =====================
  useEffect(() => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    applyTableStyles();
    editor.on("text-change", applyTableStyles);

    return () => editor.off("text-change", applyTableStyles);
  }, []);

  // =====================
  // INSERTAR TABLA
  // =====================
  const handleInsertTable = () => {
    const editor = quillRef.current.getEditor();
    editor.getModule("better-table").insertTable(rows, cols);

    setTimeout(() => {
      const tables = editor.root.querySelectorAll("table");
      const table = tables[tables.length - 1];

      if (!table) return;

      table.dataset.width = tableWidth;
      table.dataset.centered = "true";
      table.dataset.borders = "true";

      applyTableStyles();
    }, 0);
  };

  // =====================
  // ACCIONES TABLA
  // =====================
  const applyTableWidth = () => {
    const editor = quillRef.current.getEditor();
    editor.root.querySelectorAll("table").forEach((t) => {
      t.dataset.width = tableWidth;
      t.style.width = tableWidth;
    });
  };

  const centerTables = () => {
    const editor = quillRef.current.getEditor();
    editor.root.querySelectorAll("table").forEach((t) => {
      t.dataset.centered = "true";
      t.style.margin = "0 auto";
    });
  };

  const toggleTableBorders = () => {
    const editor = quillRef.current.getEditor();
    editor.root.querySelectorAll("table").forEach((t) => {
      const enabled = t.dataset.borders !== "false";
      t.dataset.borders = (!enabled).toString();
      t.classList.toggle("no-borders");
    });
  };

  // =====================
  // IMAGEN
  // =====================
  const handleInsertImage = () => {
    const url = prompt("URL de la imagen:");
    if (!url) return;

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    editor.insertEmbed(range.index, "image", url);
  };

  // =====================
  // GUARDAR
  // =====================
  const handleSave = () => {
    const editor = quillRef.current.getEditor();
    onSave(editor.getContents());
  };

  // =====================
  // CONFIG QUILL
  // =====================
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"]
    ],
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"]
    },
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: { text: "Unmerge cells" }
        }
      }
    }
  };

  return (
    <div>
      <button onClick={handleInsertImage}>Insertar imagen</button>

      <div style={{ margin: "10px 0" }}>
        <label>
          Filas:
          <input
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            style={{ width: 50, marginLeft: 5 }}
          />
        </label>

        <label style={{ marginLeft: 10 }}>
          Columnas:
          <input
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            style={{ width: 50, marginLeft: 5 }}
          />
        </label>

        <label style={{ marginLeft: 10 }}>
          Ancho:
          <input
            type="text"
            value={tableWidth}
            onChange={(e) => setTableWidth(e.target.value)}
            style={{ width: 80, marginLeft: 5 }}
          />
        </label>

        <button onClick={handleInsertTable} style={{ marginLeft: 10 }}>
          Insertar tabla
        </button>

        <button onClick={applyTableWidth} style={{ marginLeft: 10 }}>
          Aplicar ancho
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={centerTables}>Centrar tablas</button>
        <button onClick={toggleTableBorders} style={{ marginLeft: 10 }}>
          Bordes ON/OFF
        </button>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={internalValue}
        onChange={setInternalValue}
        modules={modules}
        style={{ height: 260, marginBottom: 40 }}
      />

      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Guardar
      </button>
    </div>
  );
}