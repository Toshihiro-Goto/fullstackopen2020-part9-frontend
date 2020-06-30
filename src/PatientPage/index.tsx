import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon, SemanticICONS } from "semantic-ui-react";
import axios from "axios";
import { useStateValue, addPatient } from "../state";
import { Patient, Gender } from "../types";
import { apiBaseUrl } from "../constants";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const p = Object.values(patients).find((p) => p.id === id);
    if (p != null) return setPatient(p);

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(patientFromApi);
        dispatch(addPatient(patientFromApi));
      } catch (e) {
        console.log(e);
      }
    };
    fetchPatient();
  }, [id, patients, dispatch]);

  const mapToIconName = (gender: Gender): SemanticICONS => {
    enum GenderIconName {
      female = "woman",
      male = "man",
      other = "other gender",
    }
    return GenderIconName[gender];
  };

  return patient ? (
    <>
      <h1>
        {patient.name}
        {<Icon name={mapToIconName(patient.gender)}></Icon>}
      </h1>
      <p>ssn:{patient.ssn}</p>
      <p>occupation:{patient.occupation}</p>
    </>
  ) : null;
};

export default PatientPage;
