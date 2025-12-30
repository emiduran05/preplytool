import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import ImageResize from "quill-image-resize-module-react";
import Quill from "quill";

Quill.register("modules/imageResize", ImageResize);

export default function QuillEditor({ value, onSave }) {
  const quillRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value || "");

  // ===============================
  // 🔹 Cargar contenido existente
  // ===============================
  useEffect(() => {
    if (value) {
      setInternalValue(value);
    } else {
      // 🔥 LIMPIAR EDITOR VISUAL
      setInternalValue("");
    }
  }, [value]);

  // ===============================
  // 🔹 Toolbar
  // ===============================
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"]
    ],
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"]
    }
  };

  // ===============================
  // 🔹 Redimensionar imagen real
  // ===============================
  const resizeImage = (file, newWidth) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const scale = newWidth / img.width;
        const canvas = document.createElement("canvas");

        canvas.width = newWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => resolve(blob),
          "image/jpeg",
          0.95
        );
      };
    });

  // ===============================
  // 🔹 Obtener ancho visual REAL
  // ===============================
  const getFinalImageWidth = (imgSrc) => {
    const editor = quillRef.current.getEditor();
    const imgs = editor.root.querySelectorAll("img");

    for (const img of imgs) {
      if (img.src === imgSrc) {
        return parseInt(img.style.width) || img.width;
      }
    }
    return 600; // fallback seguro
  };

  // ===============================
  // 🔹 Subir a Cloudinary
  // ===============================
  const uploadToCloudinary = async (imgUrl, finalWidth) => {
    const blob = await fetch(imgUrl).then(r => r.blob());
    const file = new File([blob], "image.jpg", { type: blob.type });

    const resizedBlob = await resizeImage(file, finalWidth);
    const resizedFile = new File([resizedBlob], "resized.jpg", {
      type: "image/jpeg"
    });

    const formData = new FormData();
    formData.append("file", resizedFile);
    formData.append("upload_preset", "ml_default");

    const CLOUD_NAME = "dzra5elov";

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await upload.json();
    return data.secure_url;
  };

  // ===============================
  // 🔹 Limpiar Delta + conservar width
  // ===============================
  const cleanDeltaImages = async (delta) => {
    const newOps = [];

    for (const op of delta.ops) {
      const img = op.insert?.image;

      if (img && (img.startsWith("blob:") || img.startsWith("data:"))) {
        const finalWidth = getFinalImageWidth(img);
        const url = await uploadToCloudinary(img, finalWidth);

        newOps.push({
          insert: { image: url },
          attributes: { width: finalWidth }
        });
      } else {
        newOps.push(op);
      }
    }

    return { ops: newOps };
  };

  // ===============================
  // 🔘 GUARDAR
  // ===============================
  const handleSave = async () => {
    const editor = quillRef.current.getEditor();
    const delta = editor.getContents();
    const cleanDelta = await cleanDeltaImages(delta);

    onSave(cleanDelta);
  };

  // ===============================
  // 🔹 Insertar imagen por URL pública
  // ===============================
  const handleInsertImageByUrl = () => {
    const url = prompt("Ingrese la URL pública de la imagen:");
    if (url) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      editor.insertEmbed(range.index, "image", url);
    }
  };

  return (
    <div>

      <button
        onClick={handleInsertImageByUrl}
        
      >
        Insertar Imagen por URL
      </button>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={internalValue}
        onChange={setInternalValue}
        modules={modules}
        style={{ height: "250px", marginBottom: "50px" }}
      />

      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          background: "#1976d2",
          border: "none",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Guardar
      </button>

      {/* 🔹 Nuevo botón para insertar imagen por URL */}
      
    </div>
  );
}