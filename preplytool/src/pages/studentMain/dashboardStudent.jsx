import { useEffect, useState } from "react";
import Header from "../../layouts/header/Header";
import AsideStudent from "../../layouts/asideStudent/asideStudent";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "./dashboardStudent.css";

/* ================================
   CONVERTIR EJERCICIOS A INPUTS
================================ */
function renderEjerciciosConInputs(delta) {
  if (!delta) return "";

  const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
  let html = converter.convert();

  let index = 0;
  html = html.replace(/\{([^}]+)\}/g, (_, answer) => `
    <input
      type="text"
      class="student-input"
      data-answer="${answer}"
      id="input-${index++}"
      placeholder="Respuesta"
    />
  `);

  return html;
}

export default function DashboardStudent() {
  const [leccionId, setLeccionId] = useState(null);

  const [tituloClase, setTituloClase] = useState("");
  const [lecturaDelta, setLecturaDelta] = useState(null);
  const [ejerciciosHTML, setEjerciciosHTML] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [vocabulario, setVocabulario] = useState([]);

  /* ================================
     CARGAR LECCIÓN
  ================================ */
  useEffect(() => {
    if (!leccionId) return;

    // 🔹 LIMPIAR CONTENIDO AL CAMBIAR DE LECCIÓN
    setTituloClase("");
    setLecturaDelta(null);
    setEjerciciosHTML("");
    setPdfUrl(null);
    setVocabulario([]);

    const fetchLeccion = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/services/leccion/${leccionId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setTituloClase(data.titulo_clase || "");
        setLecturaDelta(data.contenido_leccion || null);

        if (data.ejercicios_leccion) {
          setEjerciciosHTML(
            renderEjerciciosConInputs(data.ejercicios_leccion)
          );
        }

        setPdfUrl(data.ruta_pdf || null);
      } catch (error) {
        console.error("Error cargando lección:", error);
      }
    };

    const fetchVocabulario = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/vocabulario/${leccionId}`
        );

        if (!res.ok) return;

        const data = await res.json();
        setVocabulario(data || []);
      } catch (error) {
        console.error("Error cargando vocabulario:", error);
      }
    };

    fetchLeccion();
    fetchVocabulario();
  }, [leccionId]);

  /* ================================
     CORREGIR RESPUESTAS
  ================================ */
  const revisarRespuestas = () => {
    const inputs = document.querySelectorAll(".student-input");

    inputs.forEach((input) => {
      const correcta = input.dataset.answer.trim().toLowerCase();
      const usuario = input.value.trim().toLowerCase();

      if (usuario === correcta) {
        input.style.border = "2px solid green";
        input.style.background = "#e8f5e9";
      } else {
        input.style.border = "2px solid red";
        input.style.background = "#ffebee";
      }
    });
  };

  return (
    <>
      <Header />

      <main className="main">
        <div className="aside">
          <AsideStudent onSelect={setLeccionId} />
        </div>

        <div className="dashboard_content">
          {!leccionId ? (
            <div className="tablero_sin_seleccion">
              <h3>Tablero</h3>
              <p>Selecciona un contenido en el menú lateral.</p>
            </div>
          ) : (
            <>
              <h2 style={{ textAlign: "center" }}>{tituloClase}</h2>

              {/* ================= LECTURA ================= */}

              {lecturaDelta ? (
                <ReactQuill value={lecturaDelta} readOnly theme="bubble" />
              ) : (
                <p style={{ opacity: 0.6, textAlign: "center" }}>Esta lección no tiene lectura.</p>
              )}

              {/* ================= PDF ================= */}
{pdfUrl && (
  <>
    <h3 style={{ marginTop: "30px", textAlign: "center" }}>
      Documento de apoyo
    </h3>

    <iframe
      src={pdfUrl}
      width="100%"
      height="450px"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px"
      }}
    />

    <div style={{ textAlign: "center", marginTop: "12px" }}>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "500"
        }}
      >
        Ver en pantalla completa
      </a>
    </div>
  </>
)}


              {/* ================= EJERCICIOS ================= */}

              {ejerciciosHTML ? (
                <>
                  <div
                    className="ejercicios-estudiante"
                    dangerouslySetInnerHTML={{ __html: ejerciciosHTML }}
                  />

                  <button
                    onClick={revisarRespuestas}
                    style={{
                      marginTop: "15px",
                      padding: "10px 20px",
                      background: "#1976d2",
                      border: "none",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Revisar respuestas
                  </button>
                </>
              ) : (
                <p style={{ opacity: 0.6, textAlign: "center" }}>
                  Esta lección no tiene ejercicios.
                </p>
              )}

              {/* ================= VOCABULARIO ================= */}
              {vocabulario.length > 0 && (
                <>
                  <h3 style={{ marginTop: "30px" }}>Vocabulario</h3>

                  <table className="vocab-table">
                    <thead>
                      <tr>
                        <th>Palabra</th>
                        <th>Traducción</th>
                        <th>Ejemplo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vocabulario.map((item, index) => (
                        <tr key={index}>
                          <td>{item.palabra}</td>
                          <td>{item.traduccion}</td>
                          <td>{item.ejemplo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              
            </>
          )}
        </div>
      </main>
    </>
  );
}
