/* eslint-disable @typescript-eslint/unbound-method */
import React, { FC } from 'react';
import { Formik, Field } from 'formik';
import { HealthCheckRating } from '../../types';
import { Form, Grid, Button } from 'semantic-ui-react';
import { TextField, SelectField, SelectOption, DiagnosisSelection, NumberField, DateField } from '../../components/FormField';
import { useStateValue } from '../../state';
import { assertNever } from '../../utils';

export type EntryFormValues =
    {
        type: "Hospital" | "OccupationalHealthcare" | "HealthCheck";
        description: string;
        date: string;
        specialist: string;
        diagnosisCodes: string[];
        healthCheckRating: HealthCheckRating;
        discharge: {
            date: string;
            criteria: string;
        };
        employerName: string;
    };

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
                healthCheckRating: HealthCheckRating.Healthy,
                discharge: {
                    date: "",
                    criteria: ""
                },
                employerName: ""
            }}
            onSubmit={onSubmit}
            validate={values => {
                const { date, description, specialist, type, discharge, employerName, healthCheckRating } = values;
                const requiredError = "Field is required";

                type Errors = {
                    type?: string;
                    description?: string;
                    date?: string;
                    specialist?: string;
                    diagnosisCodes?: string;
                    healthCheckRating?: string;
                    discharge?: {
                        date?: string;
                        criteria?: string;
                    };
                    employerName?: string;
                };
                const errors: Errors = {};

                if (!date) {
                    errors.date = requiredError;
                } else if (!Date.parse(date)) {
                    errors.date = "Date is wrong.";
                }

                if (!description) {
                    errors.description = requiredError;
                }
                if (!specialist) {
                    errors.specialist = requiredError;
                }
                if (!type) {
                    errors.type = requiredError;
                }

                switch (type) {
                    case "HealthCheck":
                        const isHealthCheckRating = Object.values(HealthCheckRating).filter(rating => typeof rating === "number").some(rating => rating === healthCheckRating);
                        if (!isHealthCheckRating) {
                            errors.healthCheckRating = "Value is wrong.";
                        }
                        if (healthCheckRating !== 0 && !healthCheckRating) {
                            errors.healthCheckRating = requiredError;
                        }
                        break;
                    case "Hospital":
                        const { criteria, date } = discharge;
                        if (!criteria || !date) {
                            errors.discharge = {};
                            if (!criteria) {
                                errors.discharge.criteria = requiredError;
                            }
                            if (!date) {
                                errors.discharge.date = requiredError;
                            }
                        }
                        break;
                    case "OccupationalHealthcare":
                        if (!employerName) {
                            errors.employerName = requiredError;
                        }
                        break;
                    default:
                        assertNever(type);
                }
                return errors;
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
                {props.values.type === "HealthCheck" &&
                    <Field
                        label="HealthCheckRating"
                        name="healthCheckRating"
                        component={NumberField}
                        min={0}
                        max={3}
                    />
                }
                {props.values.type === "Hospital" &&
                    <>
                        <Field
                            label="DischargeCriteria"
                            placeholder="DischargeCriteria"
                            name="discharge.criteria"
                            component={TextField}
                        />
                        <Field
                            label="DischargeDate"
                            name="discharge.date"
                            component={DateField}
                        />
                    </>
                }
                {props.values.type === "OccupationalHealthcare" &&
                    <Field
                        label="EmployerName"
                        placeholder="EmployerName"
                        name="employerName"
                        component={TextField}
                    />
                }
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
