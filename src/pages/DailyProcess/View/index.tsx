import { Card } from '@mui/material';
import Calender from 'components/FullCalender'
import { Strings } from 'config/Strings';
import { GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext';
import { GOALS, TOKEN_KEY } from 'helper/storage';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react'
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router'

const ViewDailyProcess = () => {
    const { id } = useParams();
    const { goals, getAllGoals } = useGoalContext();

    useEffect(() => {
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
            data["title"] = Strings.incomplted
        }
        if (isCompleted) {
            data["background"] = "#008000";
            data["title"] = Strings.completed
        }
        return data

    }
    const goalTracker = useMemo(() => {
        if (!goals || goals?.length === 0) return []
        const data: GoalsStateFields = goals?.find((item) => item?.id === id);
        if (data.goalTracker?.length > 0) {
            const calenderData = data?.goalTracker.map((item) => {
                const hasDateGone = moment(new Date()).isAfter(item.startDate);
                let { background, title } = getBackgroundColorBaseOnCheckList(hasDateGone, item.isCompleted)
                return {
                    id: item.id,
                    title: title,
                    start: item.startDate,
                    end: item.endDate,
                    //    display: "background",
                    backgroundColor: background
                }
            })
            return calenderData
        }
        return []
    }, [id, goals])

    return (
        <Card className='p-0 pt-2 p-2'>
            {goalTracker.length > 0 ? <Calender data={goalTracker} /> : <div className='d-flex justify-content-center align-item-center'>
                <Spinner /></div>}

        </Card>
    )
}

export default ViewDailyProcess