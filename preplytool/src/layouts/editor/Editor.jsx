import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function QuillEditor({ value, onSave }) {
  const quillRef = useRef(null);
  const isSettingContent = useRef(false);

  const [internalValue, setInternalValue] = useState(value || "");

  // =============================
  // Sync externo → editor
  // =============================
  useEffect(() => {
    if (value === undefined || value === null) return;
    if (isSettingContent.current) return;

    isSettingContent.current = true;
    setInternalValue(value);

    requestAnimationFrame(() => {
      isSettingContent.current = false;
    });
  }, [value]);

  // =============================
  // Insertar imagen
  // =============================
  const handleInsertImage = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const url = prompt("URL de la imagen:");
    if (!url) return;

    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, "image", url);
  };

  // =============================
  // Guardar
  // =============================
  const handleSave = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    onSave(editor.getContents());
  };

  // =============================
  // CONFIG
  // =============================
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"]
    ]
  };

  return (
    <div>
      <button onClick={handleInsertImage}>Insertar imagen</button>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={internalValue}
        onChange={(content) => {
          if (isSettingContent.current) return;
          setInternalValue(content);
        }}
        modules={modules}
        style={{ height: 260, marginBottom: 40 }}
      />

      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
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
