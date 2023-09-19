import { Breadcrumbs, Card, CardContent, CardHeader, Container, Paper, Typography } from '@mui/material';
import Calender from 'components/FullCalender'
import { Strings } from 'config/Strings';
import { apiRouting } from 'config/apiRouting';
import { GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext';
import { GOALS, TOKEN_KEY } from 'helper/storage';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import AnalysisItem from '../components/AnalysisItem';
import Loader from 'components/Loader';
import Modal from 'components/Modal/Modal';

const ViewDailyProcess = () => {
    const navigator = useNavigate()
    const { id } = useParams();
    const [openModal, setOpenModal] = useState(true);
    const { goals, getAllGoals, calculateGoalProcess } = useGoalContext();

    const startDate = goals.find((item) => item.id === id)?.startDate;
    const hasShowUpdateButton = moment().isSameOrAfter(startDate)

    const modalDescription = [
        Strings.greenBackgroundColorIndicateThatYouHaveCompletedThatDay,
        Strings.redBackgroundColorIndicateThatYouHaveNotCompletedThatDay
    ]
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

    // if (goals.length === 0) {
    //     return <Loader />
    // }

    const formatDate = (date: string) => {
        // return new Date(Number(splitDate[2]), Number(splitDate[1]), Number(splitDate[0]))
        return moment(date)
    }

    const currentDate = moment()
    const currenGoalTracker: GoalsStateFields = goals?.find((item) => item?.id === id);
    const archivedDays = currenGoalTracker?.goalTracker?.filter((item) => {
        return item.isCompleted
    });
    const nonArchivedDays = currenGoalTracker?.goalTracker?.filter((item) => {
        return formatDate(item.startDate).isBefore(currentDate) && !item.isCompleted
    });

    const remainingDays = currenGoalTracker?.totalDays - (archivedDays?.length+nonArchivedDays?.length)
    const overAllProgress = calculateGoalProcess(currenGoalTracker?.totalDays, currenGoalTracker?.goalTracker)

    const analysisSData = [
        {
            value: currenGoalTracker?.totalDays,
            label: Strings.totalTargetDays
        },
        {
            value: archivedDays?.length,
            label: Strings.archivedGoalsDays
        },
        {
            value: nonArchivedDays?.length,
            label: Strings.nonArchivedDays
        },
        {
            value: overAllProgress + "%",
            label: Strings.overallProgress
        },
        {
            value: remainingDays?.length,
            label: Strings.remainingDays
        }
    ]
    const goalTracker = useMemo(() => {
        if (!goals || goals?.length === 0) return []
        const dataCurrentGoalTracker: GoalsStateFields = goals?.find((item) => item?.id === id);
        if (dataCurrentGoalTracker?.goalTracker?.length > 0) {
            const calenderData = dataCurrentGoalTracker?.goalTracker.map((item) => {
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
            }).filter((data) => data.title)
            return calenderData
        }
        return []
    }, [id, goals])
    const handlerNavigation = () => {
        const path = apiRouting.goal.dailyProcess.update.replace(":id", id!)
        navigator(`/${path}`)
    }
    const handlerModalClose = () => {
        setOpenModal(false);
    }
    return (
        <Container>
            {openModal && <Modal open={openModal} buttonText={Strings.ok} descriptions={modalDescription} title={Strings.attendation} handlerClose={handlerModalClose} />}
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
                    <div>
                        <Button onClick={handlerNavigation} type="button" >{Strings.updateDailyProgress}</Button>
                    </div>
            </div>
            {goalTracker.length > 0 ? <>
                <Paper elevation={1} className='p-0 pt-2 p-2 mt-5'>
                    <Calender data={goalTracker} />
                </Paper>
                <Card className="mt-5" sx={{ maxWidth: "400px" }}>
                    <CardHeader title={Strings.anaylsis} />
                    <CardContent>
                        {analysisSData.map(({ value, label }, index) => {
                            return <AnalysisItem value={value} label={label} key={`${index}`} />
                        })}
                    </CardContent>
                </Card>
            </> : <Loader />}
        </Container>

    )
}

export default ViewDailyProcess
