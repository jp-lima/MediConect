import React, { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

const initialBlockTemplate = {
  id: null,
  inicio: "07:00",
  termino: "18:00",
  isNew: true,
};

const emptyAvailabilityTemplate = [
  { dia: "Segunda-feira", isChecked: false, blocos: [] },
  { dia: "Terça-feira", isChecked: false, blocos: [] },
  { dia: "Quarta-feira", isChecked: false, blocos: [] },
  { dia: "Quinta-feira", isChecked: false, blocos: [] },
  { dia: "Sexta-feira", isChecked: false, blocos: [] },
  { dia: "Sábado", isChecked: false, blocos: [] },
  { dia: "Domingo", isChecked: false, blocos: [] },
];

const HorariosDisponibilidade = ({
  initialAvailability = emptyAvailabilityTemplate,
  onUpdate,
}) => {
  const [availability, setAvailability] = useState(initialAvailability);

  useEffect(() => {
    if (initialAvailability !== emptyAvailabilityTemplate) {
      setAvailability(initialAvailability);
    }
  }, [initialAvailability]);

  useEffect(() => {
    if (onUpdate) {
      onUpdate(availability);
    }
  }, [availability, onUpdate]);

  const handleDayCheck = useCallback((dayIndex, currentIsChecked) => {
    const isChecked = !currentIsChecked;

    setAvailability((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              isChecked,
              blocos: isChecked
                ? day.blocos.length === 0
                  ? [
                      {
                        ...initialBlockTemplate,
                        id: Date.now() + Math.random(),
                        isNew: true,
                      },
                    ]
                  : day.blocos
                : [],
            }
          : day
      )
    );
  }, []);

  const handleAddBlock = useCallback((dayIndex) => {
    const tempId = Date.now() + Math.random();
    const newBlock = { ...initialBlockTemplate, id: tempId, isNew: true };

    setAvailability((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              blocos: [...day.blocos, newBlock],
              isChecked: true,
            }
          : day
      )
    );
  }, []);

  const handleRemoveBlock = useCallback((dayIndex, blockId) => {
    setAvailability((prev) =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const newBlocos = day.blocos.filter((bloco) => bloco.id !== blockId);
          return {
            ...day,
            blocos: newBlocos,
            isChecked: newBlocos.length > 0,
          };
        }
        return day;
      })
    );
  }, []);

  const handleTimeChange = useCallback((dayIndex, blockId, field, value) => {
    setAvailability((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              blocos: day.blocos.map((bloco) =>
                bloco.id === blockId ? { ...bloco, [field]: value } : bloco
              ),
            }
          : day
      )
    );
  }, []);

  const renderTimeBlock = (dayIndex, bloco) => (
    <div
      key={bloco.id}
      style={{
        display: "flex",
        flexDirection: window.innerWidth < 640 ? "column" : "row",
        alignItems: window.innerWidth < 640 ? "flex-start" : "center",
        justifyContent: "space-between",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s",
        backgroundColor: bloco.isNew ? "#eef2ff" : "#ffffff",
        border: bloco.isNew ? "2px solid #6366f1" : "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth < 640 ? "column" : "row",
          gap: window.innerWidth < 640 ? "0" : "12px",
          width: window.innerWidth < 640 ? "100%" : "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: window.innerWidth < 640 ? "8px" : "0",
          }}
        >
          <label
            htmlFor={`inicio-${dayIndex}-${bloco.id}`}
            style={{ fontWeight: 500, color: "#4b5563", width: "64px" }}
          >
            Início:
          </label>
          <div style={{ position: "relative" }}>
            <input
              id={`inicio-${dayIndex}-${bloco.id}`}
              type="time"
              value={bloco.inicio}
              onChange={(e) =>
                handleTimeChange(dayIndex, bloco.id, "inicio", e.target.value)
              }
              style={{
                padding: "4px 6px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                width: "100%",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "13px"
              }}
              step="300"
            />
            <Clock
              size={12}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <label
            htmlFor={`termino-${dayIndex}-${bloco.id}`}
            style={{ fontWeight: 500, color: "#4b5563", width: "56px", fontSize: "13px" }}
          >
            Término:
          </label>
          <div style={{ position: "relative" }}>
            <input
              id={`termino-${dayIndex}-${bloco.id}`}
              type="time"
              value={bloco.termino}
              onChange={(e) =>
                handleTimeChange(dayIndex, bloco.id, "termino", e.target.value)
              }
              style={{
              padding: "4px 6px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              width: "100%",
              boxSizing: "border-box",
              outline: "none",
              fontSize: "13px",
              }}
              step="300"
            />
            <Clock
              size={12}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => handleRemoveBlock(dayIndex, bloco.id)}
        style={{
          marginTop: window.innerWidth < 640 ? "8px" : "0",
          padding: "4px 10px",
          backgroundColor: "#ef4444",
          color: "white",
          fontWeight: 600,
          borderRadius: "13px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s",
          width: window.innerWidth < 640 ? "100%" : "auto",
          cursor: "pointer",
          border: "none",
          opacity: 1,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#dc2626")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#ef4444")
        }
      >
        Remover Bloco
      </button>
      {bloco.isNew && (
        <span
          style={{
            fontSize: "12px",
            color: "#6366f1",
            marginTop: "8px",
            marginLeft: window.innerWidth < 640 ? "0" : "16px",
            fontWeight: 500,
          }}
        >
        </span>
      )}
    </div>
  );

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {availability.map((day, dayIndex) => {
          const isChecked = day.isChecked;

          const dayHeaderStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: "16px",
            backgroundColor: isChecked ? "#1f2937" : "#f9fafb",
            borderRadius: "8px",
            paddingLeft: "16px",
            paddingRight: "16px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          };

          return (
            <div
              key={day.dia}
              style={{
                backgroundColor: "#f9fafb",
                padding: "8px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  ...dayHeaderStyle,
                  backgroundColor: isChecked ? "#1f2937" : "#f9fafb",
                  borderBottom: isChecked
                    ? "1px solid #4b5563"
                    : "1px solid #e5e7eb",
                }}
                onClick={() => handleDayCheck(dayIndex, isChecked)}
              >
                <label
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: isChecked ? "white" : "#1f2937",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <span>{day.dia}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: isChecked ? "#3b82f6" : "#9ca3af",
                      marginLeft: "8px",
                    }}
                  />
                </label>
              </div>

              {isChecked && (
                <div style={{ marginTop: "16px" }}>
                  {day.blocos.length === 0 && (
                    <p
                      style={{
                        color: "#6b7280",
                        fontStyle: "italic",
                        marginBottom: "16px",
                      }}
                    >
                      Nenhum bloco de horário definido.
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {day.blocos.map((bloco) =>
                      renderTimeBlock(dayIndex, bloco)
                    )}
                  </div>

                  <button
                    onClick={() => handleAddBlock(dayIndex)}
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 22px",
                      backgroundColor: "#10b981",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#059669")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#10b981")
                    }
                  >
                    + Adicionar novo bloco
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorariosDisponibilidade;
