/* eslint-disable @typescript-eslint/unbound-method */
import React, { FC } from 'react';
import { Formik, Field } from 'formik';
import { Entry, HealthCheckRating } from '../../types';
import { Form, Grid, Button } from 'semantic-ui-react';
import { TextField, SelectField, SelectOption, DiagnosisSelection, NumberField } from '../../components/FormField';
import { useStateValue } from '../../state';
    
export type FormValues<T> = T extends infer U ? Omit<U, "id" | "entries"> : never;
export type EntryFormValues = FormValues<Entry>;

interface Props {
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}

const typeOptions: SelectOption[] = [
    { value: "HealthCheck", label: "HealthCheck" },
    { value: "Hospital", label: "Hospital" },
    { value: "OccupationalHealthcare", label: "OccupationalHealthcare" }
];

export const AddEntryForm: FC<Props> = ({ onSubmit, onCancel }) => {
    const [{ diagnoses }] = useStateValue();

    return (
        <Formik
            initialValues={{
                type: "HealthCheck",
                description: "",
                date: "",
                specialist: "",
                diagnosisCodes: [],
                healthCheckRating: HealthCheckRating.CriticalRisk
            }}
            onSubmit={onSubmit}
            validate={values => {
                const requiredFields = ["type", "description", "date", "specialist"] as const;
                const errors: { [field: string]: string } = {};
                return requiredFields.reduce((errors, field) => {
                    return values[field] ? errors : { ...errors, [field]: "Field is required." };
                }, errors);
            }
            }
        >
            {props => (<Form onSubmit={props.handleSubmit}>
                <SelectField
                    label="Type"
                    name="type"
                    options={typeOptions}
                />
                <Field
                    label="Description"
                    placeholder="Description"
                    name="description"
                    component={TextField}
                />
                <Field
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    name="date"
                    component={TextField}
                />
                <Field
                    label="Specialist"
                    placeholder="Specialist"
                    name="specialist"
                    component={TextField}
                />
                <DiagnosisSelection
                    setFieldValue={props.setFieldValue}
                    setFieldTouched={props.setFieldTouched}
                    diagnoses={Object.values(diagnoses)}
                />
                <Field
                    label="healthCheckRating"
                    name="healthCheckRating"
                    component={NumberField}
                    min={0}
                    max={3}
                />
                <Grid>
                    <Grid.Column floated="left" width={5}>
                        <Button type="button" onClick={onCancel} color="red">
                            Cancel
                    </Button>
                    </Grid.Column>
                    <Grid.Column floated="right" width={5}>
                        <Button
                            type="submit"
                            floated="right"
                            color="green"
                            disabled={!props.dirty || !props.isValid}
                        >
                            Add
                    </Button>
                    </Grid.Column>
                </Grid>
            </Form>)}
        </Formik >
    );
};

export default AddEntryForm;
