import { Strings } from 'config/Strings';
import { GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext'
import { GOALS, TOKEN_KEY, goalListDropDownOption } from 'helper/storage';
import React, { useEffect } from 'react'
import { Spinner } from 'react-bootstrap';
import "./List.scss";
import moment from 'moment';
import { Card, CardContent, CardHeader } from '@mui/material';

const Goals = () => {
    const { getAllGoals, goals, isLoading, calculateGoalProcess, onActionValueChange } = useGoalContext();
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        getAllGoals(GOALS + token)
    }, [getAllGoals])
    if (isLoading) {
        return (
            <div className='d-flex justify-content-center'>
                <Spinner />
            </div>
        )
    }

    const rows = [Strings.name, Strings.startDate, Strings.dueDate, Strings.priority, Strings.process, Strings.actions]
    const checkbox = () => {
        return (
            <div className='form-check checkbox-lg'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            </div>
        )
    }

    const renderColumn = (item: GoalsStateFields) => {
        const currentDate = moment()
        const formatStartDate = moment(item.startDate)
        const formatDueDate = moment(item.dueDate)
        console.log(formatStartDate)
        //TODO: Set the update daily process between start and due date
        const hasShowCompletedOption = formatStartDate.isSameOrBefore(currentDate)

        console.log(formatStartDate, "hasShowCompletedOption", hasShowCompletedOption)
        const infoTr = hasShowCompletedOption ? "rgb(13,202,240)" : ""
        const process = calculateGoalProcess(item.totalDays, item.goalTracker);

        return (
            <tr style={{ background: infoTr }} key={`${item.id}`}>
                {/* <td className='checkbox'>{checkbox()}</td> */}
                <td>{item.name}</td>
                <td>{item.startDate}</td>
                <td>{item.dueDate}</td>
                <td style={{
                    textTransform: "capitalize"
                }}>{item.priority}</td>
                <td className={process === 0 ? "text-danger" : "text-success"}>{process}%</td>
                <td>
                    <select defaultValue="" name="selectedActionOption" className='form-select' onChange={(e) => onActionValueChange(e.target.value, item.id, item.goalTracker)}>
                        <option disabled value={""}>{Strings.manage}</option>
                        <option value={goalListDropDownOption.edit}>{Strings.edit}</option>
                        {hasShowCompletedOption && (
                            <option value={goalListDropDownOption.updateDailyProgress}>{Strings.updateDailyProgress}</option>
                        )}
                        <option value={goalListDropDownOption.viewDailyProgress}>{Strings.viewDailyProcess}</option>
                        <option value={goalListDropDownOption.delete}>{Strings.delete}</option>
                    </select>
                </td>
            </tr>
        )
    }
    return (

        <Card>
            <CardHeader title={Strings.goals} />
            <CardContent>
                <div className='table_wrapper'>
                    <table className='table table-bordered table-hover  m-0 table-responsive'>
                        <thead>
                            <tr>
                                {rows.map((item, index) => {
                                    return <th className={!item ? 'checkbox' : ""} key={`${index}`}>{
                                        !item ? checkbox() : item
                                    }</th>
                                })}

                            </tr>
                        </thead>
                        <tbody>
                            {goals.length > 0 ? goals.map((item) => renderColumn(item)) : (
                                <tr><td style={{ textAlign: 'center' }} colSpan={8}>{Strings.noGoalAdded}</td></tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </CardContent>


        </Card>
    )
}

export default Goals