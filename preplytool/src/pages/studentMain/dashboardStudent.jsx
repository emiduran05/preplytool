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

  html = html.replace(/\{([^}]+)\}/g, (_, respuesta) => {
    return `
      <span class="input-wrapper">
        <input
          type="text"
          class="student-input"
          data-answer="${respuesta.trim().toLowerCase()}"
          placeholder="Respuesta"
          id="input-${index++}"
        />
      </span>
    `;
  });

  return html;
}

export default function DashboardStudent() {
  const [leccionId, setLeccionId] = useState(null);
  const [tituloClase, setTituloClase] = useState("");
  const [lecturaDelta, setLecturaDelta] = useState(null);
  const [ejerciciosHTML, setEjerciciosHTML] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [vocabulario, setVocabulario] = useState([]);

  const [definiciones, setDefiniciones] = useState({});
  const [ejemplos, setEjemplos] = useState({});

  /* ================================
     API - DEFINICIONES
  ================================ */
  const obtenerDefinicion = async (palabra) => {
    try {
      const res = await fetch(
        `https://corsproxy.io/?https://rae-api.com/api/words/${palabra}`
      );
      const data = await res.json();
      return data?.data?.meanings?.[0]?.senses?.[0]?.description || "Sin definición";
    } catch {
      return "Error al obtener definición";
    }
  };

  const obtenerEjemplo = async (palabra) => {
    try {
      const res = await fetch(
        `https://corsproxy.io/?https://tatoeba.org/es/api_v0/search?query=${palabra}&from=spa&to=eng`
      );
      const data = await res.json();

      const ejemplo = data?.results?.[0];
      if (!ejemplo) return "Sin ejemplo disponible";

      const traduccion = ejemplo.translations?.[0]?.[0]?.text || "";
      return `${ejemplo.text}${traduccion ? " — " + traduccion : ""}`;
    } catch {
      return "Error al obtener ejemplo";
    }
  };

  /* ================================
     CARGAR VOCABULARIO
  ================================ */
  useEffect(() => {
    if (vocabulario.length === 0) return;

    const cargarDatos = async () => {
      const defs = {};
      const ejems = {};

      await Promise.all(
        vocabulario.map(async (item) => {
          defs[item.palabra] = await obtenerDefinicion(item.palabra);
          ejems[item.palabra] = await obtenerEjemplo(item.palabra);
        })
      );

      setDefiniciones(defs);
      setEjemplos(ejems);
    };

    cargarDatos();
  }, [vocabulario]);

  /* ================================
     CARGAR LECCIÓN
  ================================ */
  useEffect(() => {
    if (!leccionId) return;

    setTituloClase("");
    setLecturaDelta(null);
    setEjerciciosHTML("");
    setPdfUrl(null);
    setVocabulario([]);

    const fetchLeccion = async () => {
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
    };

    const fetchVocabulario = async () => {
      const res = await fetch(
        `http://localhost:3000/api/vocabulario/${leccionId}`
      );
      if (!res.ok) return;

      const data = await res.json();
      setVocabulario(data || []);
    };

    fetchLeccion();
    fetchVocabulario();
  }, [leccionId]);

  /* ================================
     REVISAR RESPUESTAS
  ================================ */
  const revisarRespuestas = () => {
    document.querySelectorAll(".student-input").forEach((input) => {
      const correcta = input.dataset.answer?.trim().toLowerCase();
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

              {lecturaDelta && (
                <ReactQuill value={lecturaDelta} readOnly theme="bubble" />
              )}

              {pdfUrl && (
                <>
                  <h3 style={{ marginTop: 30 }}>Documento de apoyo</h3>
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="450px"
                    style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                  />

                  <a target="_blank" rel="noreferrer" href={pdfUrl}>
                    Ver documento completo
                  </a>
                </>
              )}

              {ejerciciosHTML && (
                <>
                  <div
                    className="ejercicios-estudiante"
                    dangerouslySetInnerHTML={{ __html: ejerciciosHTML }}
                  />

                  <button className="check" onClick={revisarRespuestas}>
                    Revisar respuestas
                  </button>
                </>
              )}

              {vocabulario.length > 0 && (
                <>
                  <h3 style={{ marginTop: "30px" }}>Vocabulario</h3>

                  <table className="vocab-table">
                    <thead>
                      <tr>
                        <th>Palabra</th>
                        <th>Definición</th>
                        <th>Ejemplo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vocabulario.map((item, index) => (
                        <tr key={index}>
                          <td>{item.palabra}</td>
                          <td>{definiciones[item.palabra] || "Cargando..."}</td>
                          <td>{ejemplos[item.palabra] || "Cargando..."}</td>
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
