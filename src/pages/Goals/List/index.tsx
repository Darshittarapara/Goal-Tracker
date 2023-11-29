import { Strings } from 'config/Strings';
import { GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext'
import { GOALS, TOKEN_KEY, goalListDropDownOption } from 'helper/storage';
import React, { useEffect } from 'react'
import { Spinner } from 'react-bootstrap';
import "./List.scss";
import moment from 'moment';
import { Card, Container, CardContent, TextField, Typography, Grid, Box } from '@mui/material';
import MaterialUISelectInput from 'components/MaterialUISelectInput/MaterialUISelectInput';
export const FilterOption = [
    { value: "all", label: Strings.all },
    { value: "high", label: Strings.high },
    { value: "medium", label: Strings.medium },
    { value: "low", label: Strings.low }
]
const Goals = () => {
    const { getAllGoals, filterList, onFilter, filterAttribute, isLoading, calculateGoalProcess, onActionValueChange, resetFilterState } = useGoalContext();
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        getAllGoals(GOALS + token)
        return () => {
            resetFilterState()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const splitDate = item.startDate?.split("-");
        const currentDate = moment()
        const formatStartDate = moment(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`)
        //TODO: Set the update daily process between start and due date
        const hasShowCompletedOption = formatStartDate.isSameOrBefore(currentDate)
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography component="h2" >Goals List</Typography>
                <TextField id="outlined-search" value={filterAttribute.query} label="Search field" type="search" onChange={(e) => onFilter(e.target.value, "query")} />
                <MaterialUISelectInput
                    className="filter-input"
                    updateFieldKey={Strings.priority.toLocaleLowerCase()} label={Strings.priority} options={FilterOption} value={filterAttribute.priority} onChange={onFilter} />
            </Grid>
            <Grid item xs = {12}>
                {filterList.length > 0 ? (
                    filterList.map((item) => {
                    return (
                        <Grid items xs={4} style = {{
                            padding: 10     ,
                            borderRadius: "10px",
                            background: "#fff",
                            border: "1px solid #f5f5f5"
                        }}>
                            <Box>
                                <Typography component="h6" >{item.name}</Typography>
                            </Box>
                            <Box>
                                <Typography component="span" >{item.name}</Typography>
                                <Typography component="span" >{item.startDate}</Typography>
                                <Typography component="span" >{item.dueDate}</Typography>
                            </Box>
                            <Box>
                                <Typography component="span" >Process : {calculateGoalProcess(item.totalDays, item.goalTracker)}</Typography>
                            </Box>
                        </Grid>    
                    )
                    })
                )  : <Box>No found</Box>}
            </Grid>
        </Grid>
    ) 
}

export default Goals
