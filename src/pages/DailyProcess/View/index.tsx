import { Breadcrumbs, Card, Container, Typography } from '@mui/material';
import Calender from 'components/FullCalender'
import { Strings } from 'config/Strings';
import { apiRouting } from 'config/apiRouting';
import { GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext';
import { GOALS, TOKEN_KEY } from 'helper/storage';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';

const ViewDailyProcess = () => {
    const navigator = useNavigate()
    const { id } = useParams();
    const { goals, getAllGoals } = useGoalContext();

    const startDate = goals.find((item) => item.id === id)?.startDate;
    const hasShowUpdateButton = moment().isSameOrAfter(startDate)
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
    const handlerNavigation = () => {
        const path = apiRouting.goal.dailyProcess.update.replace(":id", id!)
        navigator(`/${path}`)
    }
    return (
        <Container>
            <div className='progress-header'>

                <Breadcrumbs aria-label="breadcrumb">
                    <Link className='page-breadcrumbs-link' to={apiRouting.dashboard}>
                        {Strings.home}
                    </Link>
                    <Link
                        className='page-breadcrumbs-link'
                        to={apiRouting.goal.list}
                    >
                        {Strings.goals}
                    </Link>
                    <Typography color="text.primary">{Strings.viewDailyProcess}</Typography>
                </Breadcrumbs>
                {hasShowUpdateButton && (
                    <div>
                        <Button onClick={handlerNavigation} type="button" >{Strings.updateDailyProgress}</Button>
                    </div>
                )}
            </div>

            <Card className='p-0 pt-2 p-2 mt-5'>
                {goalTracker.length > 0 ? <Calender data={goalTracker} /> : <div className='d-flex justify-content-center align-item-center'>
                    <Spinner /></div>}

            </Card>
        </Container>

    )
}

export default ViewDailyProcess