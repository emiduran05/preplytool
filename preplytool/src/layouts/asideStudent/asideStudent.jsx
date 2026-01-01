import "./asideStudent.css";
import { useState, useEffect } from "react";

export default function AsideStudent({ onSelect, completedLessons }) {
  const [isloading, setIsloading] = useState(true);
  const [levelsData, setLevelsData] = useState([]);
  const [openLevel, setOpenLevel] = useState(null);
  const [openStage, setOpenStage] = useState(null);

  async function fetchLevelsData() {
    await fetch(`https://preplytool-2tgl.vercel.app/api/services/nivel/niveles/completos`)
      .then(res => res.json())
      .then(data => {
        setLevelsData(data);
        setIsloading(false);
      })
      .catch(err => console.error("Error:", err));
  }

  useEffect(() => {
    fetchLevelsData();
  }, []);

  return (
    <div className="aside_container">
      {levelsData.map((level) => (
        <div key={level.id} className="item">
          <div className="row">
            <div className="collapse_btn">
              <button
                className="display"
                onClick={() =>
                  setOpenLevel(openLevel === level.id ? null : level.id)
                }
              >
                <span className={`arrow ${openLevel === level.id ? "open" : ""}`}>
                  <i className="fa-solid fa-caret-right"></i>
                </span>
              </button>

              {level.name}
            </div>
          </div>

          {/* ETAPAS */}
          {openLevel === level.id && (
            <div className="stage_block">
              {level.stages.map((stage) => (
                <div key={stage.id}>
                  <div className="row">
                    <div className="collapse_btn stage_btn">
                      <button
                        className="display"
                        onClick={() =>
                          setOpenStage(openStage === stage.id ? null : stage.id)
                        }
                      >
                        <span
                          className={`arrow ${
                            openStage === stage.id ? "open" : ""
                          }`}
                        >
                          <i className="fa-solid fa-caret-right"></i>
                        </span>
                      </button>

                      {stage.name}
                    </div>
                  </div>

                  {/* LECCIONES */}
                  {openStage === stage.id && (
                    <div className="lesson_block">
                      {stage.lessons.map((lesson) => (
                        <div key={lesson.id} className="row lesson_row">
                          <p onClick={() => onSelect(lesson.id)}>
                            {lesson.name}
                            {completedLessons?.[lesson.id]?.completed && (
                              <span className="lesson-check">✔</span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
