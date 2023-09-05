import React, { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { AddGoalFormikFormValues } from 'Modal'
import { Card, Button, Spinner } from 'react-bootstrap'
import { Strings } from 'config/Strings'
import TextInput from 'components/TextInput'
import DateInput from 'components/DateInput'
import { SelectInput } from 'components/SelectInput'
import { priorityDropDownOptions } from '../data'
import TextareaInput from 'components/TextAreaInput'
import { GOALS, TOKEN_KEY } from 'helper/storage'
import moment from "moment";
import { AddGoalsPayload, useGoalContext } from 'context/GoalContext/GoalContext'
import { useParams } from 'react-router'
const initialValues = {
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    archiveSteps: "",
    priority: "medium"
}
const AddGoals = () => {
    const { id } = useParams()
    const { isLoading, onAddGoal, getSpecificDocs, onUpdate, isDataFetch } = useGoalContext()
    const formik = useFormik<AddGoalFormikFormValues>({
        initialValues,
        onSubmit: async (values, formikHelpers) => {
            const token = localStorage.getItem(TOKEN_KEY);
            const payload = {
                name: values.name,
                startDate: moment(values.startDate).format("DD-MM-YYYY"),
                dueDate: moment(values.endDate).format("DD-MM-YYYY"),
                goalTracker: JSON.stringify({
                    id: 0,
                    isCompleted: false
                }),
                priority: values.priority,
                archiveSteps: values.archiveSteps
            }
            const path = GOALS + token
            if (id) {
                onUpdate(payload, path, id)
            } else {
                onAddGoal(payload, path);
                formik.resetForm({
                    values: {
                        ...initialValues
                    }
                })
            }
        },
    })
    //dueDate: "01-11-2023"

    const splitStringDateConvertStringToDate = (dateString: string) => {
        const [date, month, year] = dateString?.split("-");
        return new Date(Number(year), Number(month) - 1, Number(date))

    }
    /** THIS WILL UPDATE THE DATA FOR EDIT GOAL PAGE */

    useEffect(() => {
        const updateFormikState = async (docId: string) => {
            const data: AddGoalsPayload = await getSpecificDocs(docId);
            if (data) {
                formik.resetForm({
                    values: {
                        ...formik.values,
                        archiveSteps: data?.archiveSteps,
                        startDate: splitStringDateConvertStringToDate(data?.startDate),
                        endDate: splitStringDateConvertStringToDate(data?.dueDate),
                        priority: data?.priority,
                        name: data?.name
                    }
                })
            }
        }
        if (id) {
            updateFormikState(id)
        }
        else {
            formik.resetForm({
                values: {
                    ...initialValues
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocs, id])

    const handlerChange = (value: string, name: string) => {
        formik.setFieldValue(name, value)
    }

    const handlerDateChange = (value: Date, name: string) => {
        formik.setFieldValue(name, value)
    }


    const handlerBlur = (name: string) => {
        formik.setFieldTouched(name, true);
    }

    const hasDisabled = !formik.values.endDate || !formik.values.startDate || !formik.values.priority || !formik.values.name
    return (
        <>
            {isDataFetch && id ? <div className='d-flex justify-content-center'>
                <Spinner />
            </div> : (
                <Card>
                    <Card.Header>
                        <Card.Title>{id ? Strings.updateGoal : Strings.addGoals}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='mb-2'>
                                <TextInput
                                    hasRequired={true}
                                    onBlur={handlerBlur}
                                    onChange={handlerChange}
                                    name='name'
                                    type='text'
                                    value={formik.values.name}
                                    labelText={Strings.name}
                                    placeholder={Strings.enterAGoalName}
                                />
                            </div>
                            <div className='mb-2'>
                                <DateInput
                                    onBlur={handlerBlur}
                                    onChange={handlerDateChange}
                                    name='startDate'
                                    min={new Date()}
                                    value={formik.values.startDate}
                                    labelText={Strings.startDate}
                                    placeholder={Strings.selectStartDate}
                                />
                            </div>
                            <div className='mb-2'>
                                <DateInput
                                    onBlur={handlerBlur}
                                    onChange={handlerDateChange}
                                    name='endDate'
                                    value={formik.values.endDate}
                                    labelText={Strings.dueDate}
                                    min={formik.values.startDate}
                                    placeholder={Strings.selectDueDate}
                                />
                            </div>
                            <div className='mb-2'>
                                <SelectInput
                                    onBlur={handlerBlur}
                                    onChange={handlerChange}
                                    name='priority'
                                    options={priorityDropDownOptions}
                                    value={formik.values.priority}
                                    labelText={Strings.priority}
                                    placeholder={Strings.selectAPriority}
                                />
                            </div>
                            <div className='mb-2'>
                                <TextareaInput
                                    onBlur={handlerBlur}
                                    onChange={handlerChange}
                                    name='archiveSteps'
                                    hasRequired={false}
                                    value={formik.values.archiveSteps}
                                    labelText={Strings.archiveSteps}
                                    placeholder={Strings.archiveSteps}
                                />
                            </div>
                            <Button disabled={hasDisabled || isLoading} type="submit" className='mt-2 mb-2' variant="primary">
                                {isLoading ? Strings.pleaseWait :
                                    id ? Strings.updateGoal : Strings.addGoals
                                }
                            </Button>
                        </form>
                    </Card.Body>
                </Card>
            )}

        </>

    )
}

export default AddGoals