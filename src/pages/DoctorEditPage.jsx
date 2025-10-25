import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GetDoctorByID } from "../components/utils/Functions-Endpoints/Doctor";
import DoctorForm from "../components/doctors/DoctorForm";
import { useAuth } from "../components/utils/AuthProvider";
import API_KEY from "../components/utils/apiKeys";

const ENDPOINT_AVAILABILITY =
  "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability";

const DoctorEditPage = () => {
  const { getAuthorizationHeader } = useAuth();
  const [DoctorToPUT, setDoctorPUT] = useState({});

  const Parametros = useParams();
  const [searchParams] = useSearchParams();
  const DoctorID = Parametros.id;
  const availabilityId = searchParams.get("availabilityId");

  const [availabilityToPATCH, setAvailabilityToPATCH] = useState(null);
  const [mode, setMode] = useState("doctor");

  useEffect(() => {
    const authHeader = getAuthorizationHeader();

    if (availabilityId) {
      setMode("availability");

      fetch(`${ENDPOINT_AVAILABILITY}?id=eq.${availabilityId}&select=*`, {
        method: "GET",
        headers: {
          apikey: API_KEY,
          Authorization: authHeader,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setAvailabilityToPATCH(data[0]);
            console.log("Disponibilidade vinda da API:", data[0]);
          }
        })
        .catch((err) => console.error("Erro ao buscar disponibilidade:", err));
    } else {
      setMode("doctor");
      GetDoctorByID(DoctorID, authHeader)
        .then((data) => {
          console.log(data, "médico vindo da API");
          setDoctorPUT(data[0]);
        })
        .catch((err) => console.error("Erro ao buscar paciente:", err));
    }
  }, [DoctorID, availabilityId, getAuthorizationHeader]);

  const HandlePutDoctor = async () => {
    const authHeader = getAuthorizationHeader();

    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);
    myHeaders.append("Authorization", authHeader);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(DoctorToPUT);

    console.log("Enviando médico para atualização (PUT):", DoctorToPUT);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${DoctorID}`,
        requestOptions
      );
      console.log("Resposta PUT Doutor:", response);
      alert("Dados do médico atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar médico:", error);
      alert("Erro ao atualizar dados do médico.");
      throw error;
    }
  };

  // 2. Função para Atualizar DISPONIBILIDADE (PATCH)
  const HandlePatchAvailability = async (data) => {
    const authHeader = getAuthorizationHeader();

    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);
    myHeaders.append("Authorization", authHeader);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    console.log("Enviando disponibilidade para atualização (PATCH):", data);

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${ENDPOINT_AVAILABILITY}?id=eq.${availabilityId}`,
        requestOptions
      );
      console.log("Resposta PATCH Disponibilidade:", response);
      alert("Disponibilidade atualizada com sucesso!");
      // Opcional: Redirecionar de volta para a lista de disponibilidades
      // navigate('/disponibilidades');
    } catch (error) {
      console.error("Erro ao atualizar disponibilidade:", error);
      alert("Erro ao atualizar disponibilidade.");
      throw error;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {mode === "availability"
          ? `Editar Horário Disponível (ID: ${availabilityId.substring(0, 8)})`
          : `Editar Médico (ID: ${DoctorID})`}
      </h1>

      <DoctorForm
        onSave={
          mode === "availability" ? HandlePatchAvailability : HandlePutDoctor
        }
        formData={mode === "availability" ? availabilityToPATCH : DoctorToPUT}
        setFormData={
          mode === "availability" ? setAvailabilityToPATCH : setDoctorPUT
        }
        isEditingAvailability={mode === "availability"}
      />
    </div>
  );
};

export default DoctorEditPage;
