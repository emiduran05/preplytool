import { useState, useEffect } from "react";
import "./dashboard.css";
import Header from "../../layouts/header/Header";
import Aside from "../../layouts/aside/Aside";
import QuillEditor from "../../layouts/editor/Editor";
import Vocabulary from "../../layouts/vocabulary/vocabulary";

export default function Dashboard() {
  const [leccionId, setLeccionId] = useState(null);

  const [tituloClase, setTituloClase] = useState("");

  const [lecturaDelta, setLecturaDelta] = useState(null);
  const [ejerciciosDelta, setEjerciciosDelta] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  /* ================================
     CARGAR LECCIÓN
  ================================= */
  useEffect(() => {
    if (!leccionId) return;

    setTituloClase("");
    setLecturaDelta(null);
    setEjerciciosDelta(null);
    setPdfFile(null);
    setPdfUrl(null);

    const fetchLeccion = async () => {
      try {
        const res = await fetch(
          `https://preplytool-2tgl.vercel.app/api/services/leccion/${leccionId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.titulo_clase) setTituloClase(data.titulo_clase);
        if (data.contenido_leccion) setLecturaDelta(data.contenido_leccion);
        if (data.ejercicios_leccion) setEjerciciosDelta(data.ejercicios_leccion);
        if (data.ruta_pdf) setPdfUrl(data.ruta_pdf);
      } catch (error) {
        console.error("Error cargando lección", error);
      }
    };

    fetchLeccion();
  }, [leccionId]);

  /* ================================
     GUARDAR TODO
  ================================= */
  const handleSaveAll = async () => {
    if (!leccionId) {
      alert("Selecciona una lección antes de guardar");
      return;
    }

    try {
      let finalPdfUrl = pdfUrl;

      if (pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("upload_preset", "ml_default");

        const CLOUD_NAME = "dzra5elov";

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
          {
            method: "POST",
            body: formData
          }
        );

        const data = await res.json();

        await fetch("https://preplytool-2tgl.vercel.app/api/services/leccion/documento", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leccionId,
            ruta_pdf: data.secure_url
          })
        });

        finalPdfUrl = data.secure_url;
        setPdfUrl(finalPdfUrl);
        setPdfFile(null);
      }

      // 🔹 Guardar todo (incluye título)
      await fetch("https://preplytool-2tgl.vercel.app/api/services/leccion/contenido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leccionId,
          titulo_clase: tituloClase,
          contenido_leccion: lecturaDelta,
          ejercicios_leccion: ejerciciosDelta
        })
      });

      alert("Todo guardado correctamente ✅");
    } catch (error) {
      console.error("Error guardando todo", error);
      alert("Error al guardar");
    }
  };

  /* ================================
     ELIMINAR PDF
  ================================= */
  const handleDeletePdf = async () => {
    if (!leccionId) return;

    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar el documento de apoyo?"
    );

    if (!confirmDelete) return;

    try {
      await fetch("s://phttpreplytool-2tgl.vercel.app/api/services/leccion/documento", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leccionId,
          ruta_pdf: null
        })
      });

      setPdfUrl(null);
      setPdfFile(null);

      alert("Documento eliminado correctamente 🗑️");
    } catch (error) {
      console.error("Error eliminando PDF", error);
      alert("Error al eliminar el documento");
    }
  };

  /* ================================
     ELIMINAR LECCIÓN
  ================================= */
  const handleDeleteLesson = async () => {
    if (!leccionId) return;

    const confirmDelete = window.confirm(
      "⚠️ ¿Estás seguro de que deseas eliminar esta lección?\n\nEsta acción NO se puede deshacer."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "https://preplytool-2tgl.vercel.app/api/services/leccion/delete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: leccionId })
        }
      );

      if (!res.ok) throw new Error("Error al eliminar");

      alert("Lección eliminada correctamente 🗑️");

      setLeccionId(null);
      setTituloClase("");
      setLecturaDelta(null);
      setEjerciciosDelta(null);
      setPdfFile(null);
      setPdfUrl(null);
    } catch (error) {
      console.error("Error eliminando la lección:", error);
      alert("Error al eliminar la lección");
    }
  };

  return (
    <>
      <Header />

      <main className="main">
        
        <div className="aside">
          <Aside onSelect={setLeccionId} />
        </div>

        <div className="dashboard_content">
          {!leccionId ? (
            <div className="tablero_sin_seleccion">
              <h3>Tablero</h3>
              <p>Selecciona un contenido en el menú lateral para comenzar.</p>
              <p>
                Aquí puedes editar y agregar ejercicios, lecturas y vocabulario
                para tus clases
              </p>
              <img
                src="https://img.freepik.com/vector-gratis/ilustracion-certificacion-linea_23-2148575636.jpg"
                alt=""
              />
            </div>
          ) : (
            <>
              {/* ELIMINAR */}
              <button
                onClick={handleDeleteLesson}
                style={{
                  padding: "10px 20px",
                  marginTop: "15px",
                  background: "#c62828",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "160px"
                }}
              >
                Eliminar lección
              </button>

              {/* TÍTULO EDITABLE */}
              <input
                type="text"
                value={tituloClase}
                onChange={(e) => setTituloClase(e.target.value)}
                placeholder="Título de la clase"
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "18px",
                  textAlign: "center",
                  margin: "15px 0",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />

              <h3 align="center">Lectura</h3>
              <QuillEditor
                value={lecturaDelta}
                onSave={(delta) => setLecturaDelta(delta)}
              />

              <h3 align="center">Ejercicios</h3>
              <p align="center">
                Usa llaves para respuestas: {"{respuesta correcta}"}
              </p>

              <QuillEditor
                value={ejerciciosDelta}
                onSave={(delta) => setEjerciciosDelta(delta)}
              />

              <h3 align="center">Documento de apoyo</h3>

              <input
                key={leccionId}
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
              />

              {pdfUrl && (
                <>
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="450px"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                  />

                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      Ver documento completo
                    </a>
                  </div>

                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <button
                      onClick={handleDeletePdf}
                      style={{
                        padding: "8px 16px",
                        background: "#d32f2f",
                        border: "none",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Eliminar documento
                    </button>
                  </div>
                </>
              )}

              <Vocabulary lessonId={leccionId} />

              <button
                className="guardar_todo"
                onClick={handleSaveAll}
                style={{
                  padding: "10px 20px",
                  marginTop: "10px",
                  background: "#1976d2",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "160px"
                }}
              >
                Guardar todo
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
