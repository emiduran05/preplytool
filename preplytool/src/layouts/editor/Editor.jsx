import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import ImageResize from "quill-image-resize-module-react";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";

/**
 * =====================
 * REGISTRO SEGURO DE MÓDULOS
 * =====================
 */
let quillModulesRegistered = false;

function registerQuillModules() {
  if (quillModulesRegistered) return;

  const Quill = ReactQuill.Quill;
  if (!Quill) return;

  Quill.register(
    {
      "modules/imageResize": ImageResize,
      "modules/better-table": QuillBetterTable,
    },
    true
  );

  quillModulesRegistered = true;
}

export default function QuillEditor({ value = "", onSave }) {
  const quillRef = useRef(null);

  const [internalValue, setInternalValue] = useState(value || "");
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableWidth, setTableWidth] = useState("100%");

  /**
   * =====================
   * REGISTRAR MÓDULOS (1 VEZ)
   * =====================
   */
  useEffect(() => {
    registerQuillModules();
  }, []);

  /**
   * =====================
   * SINCRONIZAR HTML EXTERNO
   * =====================
   */
  useEffect(() => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    editor.root.innerHTML = value || "";
    setInternalValue(value || "");
  }, [value]);

  /**
   * =====================
   * ESTILOS DE TABLAS
   * =====================
   */
  const applyTableStyles = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    editor.root.querySelectorAll("table").forEach((table) => {
      const { width, centered, borders } = table.dataset;

      if (width) table.style.width = width;
      if (centered === "true") table.style.margin = "0 auto";

      if (borders === "false") table.classList.add("no-borders");
      else table.classList.remove("no-borders");
    });
  };

  useEffect(() => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    applyTableStyles();
    editor.on("text-change", applyTableStyles);

    return () => editor.off("text-change", applyTableStyles);
  }, []);

  /**
   * =====================
   * TABLAS
   * =====================
   */
  const handleInsertTable = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const tableModule = editor.getModule("better-table");
    if (!tableModule) return;

    tableModule.insertTable(rows, cols);

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

  const applyTableWidth = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    editor.root.querySelectorAll("table").forEach((t) => {
      t.dataset.width = tableWidth;
      t.style.width = tableWidth;
    });
  };

  const centerTables = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    editor.root.querySelectorAll("table").forEach((t) => {
      t.dataset.centered = "true";
      t.style.margin = "0 auto";
    });
  };

  const toggleTableBorders = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    editor.root.querySelectorAll("table").forEach((t) => {
      const enabled = t.dataset.borders !== "false";
      t.dataset.borders = (!enabled).toString();
      t.classList.toggle("no-borders", enabled);
    });
  };

  /**
   * =====================
   * IMÁGENES
   * =====================
   */
  const handleInsertImage = () => {
    const url = prompt("URL de la imagen:");
    if (!url) return;

    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, "image", url);
  };

  /**
   * =====================
   * GUARDAR HTML
   * =====================
   */
  const handleSave = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    onSave(editor.root.innerHTML);
  };

  /**
   * =====================
   * CONFIG QUILL
   * =====================
   */
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: { text: "Unmerge cells" },
        },
      },
    },
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
            onChange={(e) => setRows(+e.target.value)}
            style={{ width: 50, marginLeft: 5 }}
          />
        </label>

        <label style={{ marginLeft: 10 }}>
          Columnas:
          <input
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(+e.target.value)}
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
          cursor: "pointer",
        }}
      >
        Guardar
      </button>
    </div>
  );
}


// import { useEffect, useRef, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import "quill-better-table/dist/quill-better-table.css";

// export default function QuillEditor({ value = "", onSave }) {
//   const quillRef = useRef(null);
//   const [internalValue, setInternalValue] = useState(value || "");

//   const [rows, setRows] = useState(2);
//   const [cols, setCols] = useState(2);
//   const [tableWidth, setTableWidth] = useState("100%");

//   // =====================
//   // REGISTRO DE MÓDULOS (UNA SOLA VEZ)
//   // =====================
//   useEffect(() => {
//     const Quill = require("quill");
//     const ImageResize = require("quill-image-resize-module-react").default;
//     const QuillBetterTable = require("quill-better-table");

//     if (!Quill.imports["modules/imageResize"]) {
//       Quill.register(
//         {
//           "modules/imageResize": ImageResize,
//           "modules/better-table": QuillBetterTable,
//         },
//         true
//       );
//     }
//   }, []);

//   // =====================
//   // SINCRONIZAR VALOR EXTERNO
//   // =====================
//   useEffect(() => {
//     setInternalValue(value || "");
//   }, [value]);

//   // =====================
//   // APLICAR ESTILOS A TABLAS
//   // =====================
//   const applyTableStyles = () => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     editor.root.querySelectorAll("table").forEach((table) => {
//       const width = table.dataset.width;
//       const centered = table.dataset.centered;
//       const borders = table.dataset.borders;

//       if (width) table.style.width = width;
//       if (centered === "true") table.style.margin = "0 auto";

//       if (borders === "false") table.classList.add("no-borders");
//       else table.classList.remove("no-borders");
//     });
//   };

//   // =====================
//   // REAPLICAR ESTILOS AL EDITAR
//   // =====================
//   useEffect(() => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     applyTableStyles();
//     editor.on("text-change", applyTableStyles);

//     return () => {
//       editor.off("text-change", applyTableStyles);
//     };
//   }, []);

//   // =====================
//   // INSERTAR TABLA
//   // =====================
//   const handleInsertTable = () => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     const tableModule = editor.getModule("better-table");
//     if (!tableModule) return;

//     tableModule.insertTable(rows, cols);

//     setTimeout(() => {
//       const tables = editor.root.querySelectorAll("table");
//       const table = tables[tables.length - 1];
//       if (!table) return;

//       table.dataset.width = tableWidth;
//       table.dataset.centered = "true";
//       table.dataset.borders = "true";

//       applyTableStyles();
//     }, 0);
//   };

//   // =====================
//   // ACCIONES SOBRE TABLAS
//   // =====================
//   const applyTableWidth = () => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     editor.root.querySelectorAll("table").forEach((t) => {
//       t.dataset.width = tableWidth;
//       t.style.width = tableWidth;
//     });
//   };

//   const centerTables = () => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     editor.root.querySelectorAll("table").forEach((t) => {
//       t.dataset.centered = "true";
//       t.style.margin = "0 auto";
//     });
//   };

//   const toggleTableBorders = () => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     editor.root.querySelectorAll("table").forEach((t) => {
//       const enabled = t.dataset.borders !== "false";
//       t.dataset.borders = (!enabled).toString();
//       t.classList.toggle("no-borders", enabled);
//     });
//   };

//   // =====================
//   // INSERTAR IMAGEN
//   // =====================
//   const handleInsertImage = () => {
//     const url = prompt("URL de la imagen:");
//     if (!url) return;

//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     const range = editor.getSelection(true);
//     editor.insertEmbed(range.index, "image", url);
//   };

//   // =====================
//   // GUARDAR HTML
//   // =====================
//   const handleSave = () => {
//     const editor = quillRef.current?.getEditor();
//     if (!editor) return;

//     onSave?.(editor.root.innerHTML);
//   };

//   // =====================
//   // CONFIGURACIÓN QUILL
//   // =====================
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ align: [] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image", "video"],
//       [{ color: [] }, { background: [] }],
//       ["clean"],
//     ],
//     imageResize: {
//       modules: ["Resize", "DisplaySize", "Toolbar"],
//     },
//     "better-table": {
//       operationMenu: {
//         items: {
//           unmergeCells: { text: "Unmerge cells" },
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <button onClick={handleInsertImage}>Insertar imagen</button>

//       <div style={{ margin: "10px 0" }}>
//         <label>
//           Filas:
//           <input
//             type="number"
//             min={1}
//             value={rows}
//             onChange={(e) => setRows(Number(e.target.value))}
//             style={{ width: 50, marginLeft: 5 }}
//           />
//         </label>

//         <label style={{ marginLeft: 10 }}>
//           Columnas:
//           <input
//             type="number"
//             min={1}
//             value={cols}
//             onChange={(e) => setCols(Number(e.target.value))}
//             style={{ width: 50, marginLeft: 5 }}
//           />
//         </label>

//         <label style={{ marginLeft: 10 }}>
//           Ancho:
//           <input
//             type="text"
//             value={tableWidth}
//             onChange={(e) => setTableWidth(e.target.value)}
//             style={{ width: 80, marginLeft: 5 }}
//           />
//         </label>

//         <button onClick={handleInsertTable} style={{ marginLeft: 10 }}>
//           Insertar tabla
//         </button>

//         <button onClick={applyTableWidth} style={{ marginLeft: 10 }}>
//           Aplicar ancho
//         </button>
//       </div>

//       <div style={{ marginBottom: 10 }}>
//         <button onClick={centerTables}>Centrar tablas</button>
//         <button onClick={toggleTableBorders} style={{ marginLeft: 10 }}>
//           Bordes ON/OFF
//         </button>
//       </div>

//       <ReactQuill
//         ref={quillRef}
//         theme="snow"
//         value={internalValue}
//         onChange={setInternalValue}
//         modules={modules}
//         style={{ height: 260, marginBottom: 40 }}
//       />

//       <button
//         onClick={handleSave}
//         style={{
//           padding: "10px 20px",
//           background: "#1976d2",
//           color: "white",
//           border: "none",
//           borderRadius: 6,
//           cursor: "pointer",
//         }}
//       >
//         Guardar
//       </button>
//     </div>
//   );
// }
