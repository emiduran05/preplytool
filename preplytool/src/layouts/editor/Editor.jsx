// src/layouts/editor/Editor.jsx
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = lazy(() => import("react-quill-new"));

export default function QuillEditor({ value = "", onSave }) {
  const quillRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value);

  // Estado para tablas
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableWidth, setTableWidth] = useState("100%");
  const [centered, setCentered] = useState(true);
  const [borders, setBorders] = useState(true);

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const getEditor = () => quillRef.current?.getEditor();

  // =====================
  // TABLAS: insertar y estilizar
  // =====================
  const buildTableHTML = () => {
    const borderStyle = borders ? "1px solid #ccc" : "none";
    const marginStyle = centered ? "0 auto" : "0";
    let tableHTML = `<table style="width:${tableWidth}; border:${borderStyle}; border-collapse:collapse; margin:${marginStyle};">`;
    for (let r = 0; r < rows; r++) {
      tableHTML += "<tr>";
      for (let c = 0; c < cols; c++) {
        tableHTML += `<td style="border:${borderStyle}; padding:6px;">Fila ${r + 1}, Col ${c + 1}</td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    return tableHTML;
  };

  const handleInsertTable = () => {
    const editor = getEditor();
    if (!editor) return;

    const html = buildTableHTML();
    const range = editor.getSelection(true);
    editor.clipboard.dangerouslyPasteHTML(range?.index ?? 0, html);
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

      if (!borders) t.classList.add("no-borders");
      else t.classList.remove("no-borders");
    });
  };

  useEffect(() => {
    const editor = getEditor();
    if (!editor) return;

    const handler = () => applyTableStyles();
    handler();
    editor.on("text-change", handler);
    return () => editor.off("text-change", handler);
  }, []);

  // =====================
  // IMÁGENES: insertar normal
  // =====================
  const handleInsertImage = () => {
    const url = prompt("URL de la imagen:");
    if (!url) return;

    const editor = getEditor();
    if (!editor) return;

    const range = editor.getSelection(true);
    editor.insertEmbed(range?.index ?? 0, "image", url, "user");
  };

  // =====================
  // RESIZE MANUAL: envolver con handles en el DOM
  // =====================

  // Crea wrapper .img-box con handles alrededor de la imagen
  const createWrapperForImage = (img) => {
    if (!img || img.closest(".img-box")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "img-box";
    wrapper.contentEditable = "false"; // evita que el cursor se meta en el wrapper
    wrapper.style.display = "inline-block";
    wrapper.style.position = "relative";
    wrapper.style.maxWidth = "100%";

    // Inserta wrapper antes y mueve la imagen dentro
    const parent = img.parentElement;
    if (!parent) return;
    parent.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Marcar imagen con clase para estilos
    img.classList.add("img-resizable");

    // Crear handles
    const dirs = ["tl", "tr", "bl", "br"];
    dirs.forEach((dir) => {
      const h = document.createElement("span");
      h.className = `img-handle handle-${dir}`;
      h.dataset.dir = dir;
      wrapper.appendChild(h);
    });
  };

  useEffect(() => {
    const editor = getEditor();
    if (!editor) return;
    const root = editor.root;

    // Envolver todas las imágenes iniciales
    root.querySelectorAll("img").forEach((img) => createWrapperForImage(img));

    // Observer para envolver nuevas imágenes agregadas
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node;
            if (el instanceof HTMLImageElement) {
              createWrapperForImage(el);
            } else {
              el.querySelectorAll?.("img").forEach((img) => createWrapperForImage(img));
            }
          }
        });
      });
    });

    observer.observe(root, { childList: true, subtree: true });

    // Selección y arrastre
    let active = null; // { wrapper, img, startX, startY, startW, startH, dir }

    const onMouseDown = (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.classList.contains("img-handle")) {
        e.preventDefault();
        const wrapper = target.closest(".img-box");
        const img = wrapper?.querySelector("img.img-resizable");
        if (!wrapper || !img) return;

        const rect = img.getBoundingClientRect();
        active = {
          wrapper,
          img,
          startX: e.clientX,
          startY: e.clientY,
          startW: rect.width,
          startH: rect.height,
          dir: target.dataset.dir,
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
    };

    const onMouseMove = (e) => {
      if (!active) return;
      const dx = e.clientX - active.startX;
      const dy = e.clientY - active.startY;

      let newW = active.startW;
      let newH = active.startH;

      switch (active.dir) {
        case "br":
          newW = active.startW + dx;
          newH = active.startH + dy;
          break;
        case "bl":
          newW = active.startW - dx;
          newH = active.startH + dy;
          break;
        case "tr":
          newW = active.startW + dx;
          newH = active.startH - dy;
          break;
        case "tl":
          newW = active.startW - dx;
          newH = active.startH - dy;
          break;
        default:
          break;
      }

      newW = Math.max(50, newW);
      newH = Math.max(50, newH);

      active.img.style.width = `${Math.round(newW)}px`;
      active.img.style.height = `${Math.round(newH)}px`;
      active.wrapper.style.width = `${Math.round(newW)}px`;
      active.wrapper.style.height = `${Math.round(newH)}px`;
    };

    const onMouseUp = () => {
      active = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onClick = (e) => {
      const target = e.target;

      // Al hacer clic en imagen, marcar selección y asegurar wrapper
      if (target instanceof HTMLImageElement) {
        createWrapperForImage(target);
        const wrapper = target.closest(".img-box");
        if (wrapper) {
          root.querySelectorAll(".img-box.selected").forEach((w) => w.classList.remove("selected"));
          wrapper.classList.add("selected");
        }
      } else if (!(target instanceof HTMLElement && target.closest(".img-box"))) {
        // click fuera: quitar selección
        root.querySelectorAll(".img-box.selected").forEach((w) => w.classList.remove("selected"));
      }
    };

    root.addEventListener("mousedown", onMouseDown);
    root.addEventListener("click", onClick);

    return () => {
      observer.disconnect();
      root.removeEventListener("mousedown", onMouseDown);
      root.removeEventListener("click", onClick);
    };
  }, []);

  // =====================
  // GUARDAR HTML
  // =====================
  const handleSave = () => {
    const editor = getEditor();
    if (!editor) return;
    const html = editor.root.innerHTML;
    onSave?.(html);
  };

  // =====================
  // CONFIGURACIÓN QUILL
  // =====================
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
  };

  return (
    <div>
      {/* Acciones de imagen */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleInsertImage}>Insertar imagen</button>
      </div>

      {/* Controles de tabla */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <label>
          Filas:
          <input
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            style={{ width: 60, marginLeft: 6 }}
          />
        </label>

        <label>
          Columnas:
          <input
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            style={{ width: 60, marginLeft: 6 }}
          />
        </label>

        <label>
          Ancho:
          <input
            type="text"
            value={tableWidth}
            onChange={(e) => setTableWidth(e.target.value)}
            placeholder="e.g. 100% o 600px"
            style={{ width: 120, marginLeft: 6 }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Centrar:
          <input
            type="checkbox"
            checked={centered}
            onChange={(e) => setCentered(e.target.checked)}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Bordes:
          <input
            type="checkbox"
            checked={borders}
            onChange={(e) => setBorders(e.target.checked)}
          />
        </label>

        <button onClick={handleInsertTable}>Insertar tabla</button>
        <button onClick={applyTableStyles}>Aplicar estilos</button>
      </div>

      {/* Editor */}
      <Suspense fallback={<div>Cargando editor...</div>}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={internalValue}
          onChange={setInternalValue}
          modules={modules}
          style={{ height: 320, marginBottom: 60 }}
        />
      </Suspense>

      {/* Guardar */}
      <button
        onClick={handleSave}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Guardar
      </button>
    </div>
  );
}