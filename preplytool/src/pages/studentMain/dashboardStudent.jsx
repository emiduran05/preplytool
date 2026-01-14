import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layouts/header/Header";
import AsideStudent from "../../layouts/asideStudent/asideStudent";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "./dashboardStudent.css";

/* ================== EJERCICIOS ================== */
function renderEjerciciosConInputs(html) {
  if (!html) return "";

  let index = 0;
  html = html.replace(/\{([^}]+)\}/g, (_, r) => `
    <span class="input-wrapper">
      <input
        type="text"
        class="student-input"
        data-answer="${r.trim().toLowerCase()}"
        placeholder="Respuesta"
        id="input-${index++}"
      />
    </span>
  `);

  return html;
}

export default function DashboardStudent() {
  const { studentID } = useParams();

  const [leccionId, setLeccionId] = useState(null);
  const [orderedLessons, setOrderedLessons] = useState([]);

  const [tituloClase, setTituloClase] = useState("");
  const [lecturaDelta, setLecturaDelta] = useState(null);
  const [ejerciciosHTML, setEjerciciosHTML] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const [completedLessons, setCompletedLessons] = useState({});
  const [previousNotes, setPreviousNotes] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");

  const [vocabulario, setVocabulario] = useState([]);
  const [definiciones, setDefiniciones] = useState({});
  const [ejemplos, setEjemplos] = useState({});

  /* ================== APIs vocabulario ================== */
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
      if (!ejemplo) return "Sin ejemplo";
      return `${ejemplo.text} — ${ejemplo.translations?.[0]?.[0]?.text || ""}`;
    } catch {
      return "Error al obtener ejemplo";
    }
  };

  /* ================== PROGRESO ================== */
  useEffect(() => {
    fetch(`https://preplytool-2tgl.vercel.app/api/student-lessons/${studentID}`)
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(r => {
          map[r.lesson_id] = {
            completed: r.completed,
            notes: r.notes
          };
        });
        setCompletedLessons(map);
      });
  }, [studentID]);

  /* ================== ORDEN DE LECCIONES ================== */
  useEffect(() => {
    fetch("https://preplytool-2tgl.vercel.app/api/services/nivel/niveles/completos")
      .then(res => res.json())
      .then(data => {
        const list = [];
        data.forEach(n =>
          n.stages.forEach(s =>
            s.lessons.forEach(l =>
              list.push({ id: l.id, name: l.name })
            )
          )
        );
        setOrderedLessons(list);
      });
  }, []);

  const currentIndex = orderedLessons.findIndex(l => l.id === leccionId);
  const previousLessonId =
    currentIndex > 0 ? orderedLessons[currentIndex - 1].id : null;

  /* ================== LECCIÓN ================== */
  useEffect(() => {
    if (!leccionId) return;

    fetch(`https://preplytool-2tgl.vercel.app/api/services/leccion/${leccionId}`)
      .then(res => res.json())
      .then(data => {
        setTituloClase(data.titulo_clase);
        setLecturaDelta(data.contenido_leccion);
        setPdfUrl(data.ruta_pdf);

        if (data.ejercicios_leccion) {
          setEjerciciosHTML(
            renderEjerciciosConInputs(data.ejercicios_leccion)
          );
        } else {
          setEjerciciosHTML("");
        }
      });

    fetch(`https://preplytool-2tgl.vercel.app/api/vocabulario/${leccionId}`)
      .then(res => res.json())
      .then(setVocabulario);
  }, [leccionId]);

  /* ================== CARGAR DEFINICIONES ================== */
  useEffect(() => {
    if (!vocabulario.length) return;

    const load = async () => {
      const defs = {};
      const exs = {};

      for (const v of vocabulario) {
        defs[v.palabra] = await obtenerDefinicion(v.palabra);
        exs[v.palabra] = await obtenerEjemplo(v.palabra);
      }

      setDefiniciones(defs);
      setEjemplos(exs);
    };

    load();
  }, [vocabulario]);

  /* ================== NOTAS ================== */
  useEffect(() => {
    setPreviousNotes(
      previousLessonId ? completedLessons[previousLessonId]?.notes || "" : ""
    );
    setCurrentNotes(completedLessons[leccionId]?.notes || "");
  }, [previousLessonId, leccionId, completedLessons]);

  const saveNotes = async (lessonId, notes) => {
    if (!lessonId) return;

    await fetch("https://preplytool-2tgl.vercel.app/api/student-lessons/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: Number(studentID),
        lesson_id: Number(lessonId),
        notes
      })
    });

    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        notes
      }
    }));
  };

  const toggleCompleted = async (checked) => {
    await fetch("https://preplytool-2tgl.vercel.app/api/student-lessons/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: Number(studentID),
        lesson_id: Number(leccionId),
        completed: checked
      })
    });

    setCompletedLessons(prev => ({
      ...prev,
      [leccionId]: {
        ...prev[leccionId],
        completed: checked
      }
    }));
  };

  const hasExercises = ejerciciosHTML.includes("student-input");

  const revisarRespuestas = () => {
    document.querySelectorAll(".student-input").forEach(input => {
      const ok = input.value.trim().toLowerCase() === input.dataset.answer;
      input.style.border = ok ? "2px solid green" : "2px solid red";
      input.style.background = ok ? "#e8f5e9" : "#ffebee";
    });
  };

  return (
    <>
      <Header />

      <main className="main">
        <div className="aside">
          <AsideStudent
            onSelect={setLeccionId}
            completedLessons={completedLessons}
          />
        </div>

        <div className="dashboard_content">
          {!leccionId ? (
            <p>Selecciona una lección</p>
          ) : (
            <>
              {/* NOTAS ANTERIORES */}
              {previousLessonId && (
                <>
                  <h3>📝 Notas de la clase anterior</h3>
                  <textarea
                    value={previousNotes}
                    onChange={e => setPreviousNotes(e.target.value)}
                    onBlur={() =>
                      saveNotes(previousLessonId, previousNotes)
                    }
                    style={{ width: "100%", minHeight: 120 }}
                  />
                </>
              )}

              <h2>{tituloClase}</h2>

              {lecturaDelta && (
                <ReactQuill value={lecturaDelta} readOnly theme="bubble" />
              )}

              {pdfUrl && (
                <>
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="450px"
                  style={{ border: "1px solid #ccc" }}
                />

                <a target="blank" href={pdfUrl} style={{textAlign: "center"}}>Ver documento completo</a>
                </>
                
              )}

              {hasExercises && (
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

              {/* VOCABULARIO */}
              {vocabulario.length > 0 && (
                <>
                  <h3 style={{ marginTop: 30 }}>Vocabulario</h3>
                  <table className="vocab-table">
                    <thead>
                      <tr>
                        <th>Palabra</th>
                        <th>Definición</th>
                        <th>Ejemplo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vocabulario.map((v, i) => (
                        <tr key={i}>
                          <td>{v.palabra}</td>
                          <td>{definiciones[v.palabra] || "Cargando..."}</td>
                          <td>{ejemplos[v.palabra] || "Cargando..."}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <label style={{ display: "block", marginTop: 20 }}>
                <input
                  type="checkbox"
                  checked={completedLessons[leccionId]?.completed || false}
                  onChange={(e) => toggleCompleted(e.target.checked)}
                />
                Marcar como completada
              </label>

              <h3 style={{ marginTop: 30 }}>📝 Notas para la siguiente clase</h3>
              <textarea
                value={currentNotes}
                onChange={e => setCurrentNotes(e.target.value)}
                onBlur={() => saveNotes(leccionId, currentNotes)}
                style={{ width: "100%", minHeight: 120 }}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
}


