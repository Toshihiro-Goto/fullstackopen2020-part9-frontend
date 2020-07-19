import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon, SemanticICONS } from "semantic-ui-react";
import axios from "axios";
import Entries from './Entries';
import { useStateValue, addPatient } from "../state";
import { Patient, Gender } from "../types";
import { apiBaseUrl } from "../constants";

const PatientPage: FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const patientInState = Object.values(patients).find((p) => p.id === id);
    if (patientInState) return setPatient(patientInState);

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
  }, [dispatch, id, patients]);

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
        <Icon name={mapToIconName(patient.gender)} />
      </h1>
      <p>ssn:{patient.ssn}</p>
      <p>occupation:{patient.occupation}</p>
      <Entries entries={patient.entries} />
    </>
  ) : null;
};

export default PatientPage;
