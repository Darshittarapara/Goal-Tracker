import { Card, Container } from '@mui/material';
import Calender from 'components/FullCalender'
import { Strings } from 'config/Strings';
import { GoalTrackerType, GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext';
import { GOALS, TOKEN_KEY } from 'helper/storage';
import moment from 'moment';
import React, { useEffect, useCallback } from 'react'
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router'
import { Button } from 'react-bootstrap';
import Loader from 'components/Loader';

const UpdateDailyProcess = () => {
    const { id } = useParams();
    const { goals, getAllGoals, onDateSelected, selectedDate, isLoading, onUpdateGoalProcess } = useGoalContext();

    useEffect(() => {
        console.log("this effect run")
        const token = localStorage.getItem(TOKEN_KEY);
        getAllGoals(GOALS + token)
    }, [getAllGoals])

    const getBackgroundColorBaseOnCheckList = (hasDateGone: boolean, isCompleted: boolean) => {
        const data = {
            background: "transparent",
            title: ""
        }
        if (hasDateGone && !isCompleted) {

            data["background"] = "#8B0000";
        }
        if (isCompleted) {
            data["background"] = "#008000";
        }
        return data

    }
    const goalTracker = useCallback(() => {
        if (!goals || goals?.length === 0) return []
        const data: GoalsStateFields = goals?.find((item) => item?.id === id);
        const arrayFormGoalTracker: GoalTrackerType[] = typeof (data?.goalTracker) === "string" ? JSON.parse(data?.goalTracker) : data?.goalTracker
        if (arrayFormGoalTracker.length > 0) {
            const calenderData = arrayFormGoalTracker.map((item: GoalTrackerType) => {
                const hasDateGone = moment(new Date()).isAfter(item.startDate);
                let { background, title } = getBackgroundColorBaseOnCheckList(hasDateGone, item.isCompleted)
                return {
                    id: item.id,
                    title: title,
                    start: item.startDate,
                    end: item.endDate,
                    display: "background",
                    backgroundColor: background
                }
            })
            return calenderData
        }
        return []
    }, [id, goals])

    const updateGoalProcess = () => {
        onUpdateGoalProcess(id!)
    }
    const handlerDateSelected = (date: string) => {
        onDateSelected(date, id!)
    }
    console.log("goals", goals)
    return (
        <Container>
            <div className="d-flex justify-content-end">
                <Button onClick={updateGoalProcess} type="button" disabled={selectedDate.length === 0 || isLoading}>{isLoading ? Strings.pleaseWait : Strings.update}</Button>
            </div>
            <Card className='p-0 pt-2 p-2 mt-5'>
                {(goalTracker().length === 0 || isLoading) ? <Loader /> : <Calender onDateSelected={handlerDateSelected} hasSelected={true} data={goalTracker()} />}
            </Card>
        </Container>
    )
}

export default UpdateDailyProcess