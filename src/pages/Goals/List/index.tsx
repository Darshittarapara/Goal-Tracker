import { Strings } from 'config/Strings';
import { GoalsStateFields, useGoalContext } from 'context/GoalContext/GoalContext'
import { GOALS, TOKEN_KEY, goalListDropDownOption } from 'helper/storage';
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import "./List.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  {Link} from "react-router-dom"
import {  TextField, Typography, Box } from '@mui/material';
import MaterialUISelectInput from 'components/MaterialUISelectInput/MaterialUISelectInput';
import { setBackground } from 'helper/storage';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { apiRouting } from 'config/apiRouting';

export const FilterOption = [
    { value: "all", label: Strings.all },
    { value: "high", label: Strings.high },
    { value: "medium", label: Strings.medium },
    { value: "low", label: Strings.low }
]
const Goals = () => {
    const { getAllGoals, filterList, onFilter, filterAttribute, isLoading, calculateGoalProcess, onActionValueChange, resetFilterState } = useGoalContext();
    const [selectedDropDownId, setSelectedDropDownId]= useState<string | null>(null);
 
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        getAllGoals(GOALS + token)
        return () => {
            resetFilterState()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAllGoals])
 
    useEffect(() => {
const handlerRemoveDropdownId = () => {
    setSelectedDropDownId(null)
}
window.addEventListener("click", handlerRemoveDropdownId);
return () => {
    window.removeEventListener("click", handlerRemoveDropdownId)
}
    },[])
    if (isLoading) {
        return (
            <div className='d-flex justify-content-center'>
                <Spinner />
            </div>
        )
    }


 
    const cutGoalName = (name: string) => {
return name.slice(0, 50)
    }

    const handlerDropDown = (id: string) => {
        if(id === selectedDropDownId)  {
            setSelectedDropDownId(null);
            return
        }
        setSelectedDropDownId(id)
    }
    return (
        <>
        
        <div className ="goal-container">
            <div className = "goal-header">
            <Typography component="h2" variant = "h4" >Goals List</Typography>
            <div className = "filter">
            <TextField id="outlined-search" value={filterAttribute.query} label="Search field" type="search" onChange={(e) => onFilter(e.target.value, "query")} />
                <MaterialUISelectInput
                    className="filter-input"
                    updateFieldKey={Strings.priority.toLocaleLowerCase()} label={Strings.priority} options={FilterOption} value={filterAttribute.priority} onChange={onFilter} />
            </div>
            </div>
            <div className = "goal-list">
            {filterList.length > 0 ? (
                    filterList.map((item: GoalsStateFields) => {
                    return (
                        <div className = "contain" >
                            <div className ="goal-description-container">
                            <div className = "name-container">
                                <Typography  title ={item.name} component="h2" >{cutGoalName(item.name)}...</Typography>
                                <FontAwesomeIcon onClick = {(e) => {
                                    e.stopPropagation()
                                     handlerDropDown(item.id);
                                }} className='dropdown-icon' icon={faEllipsisVertical} />

                                      {/**DropDown Option */}
                            <div className= "dropdown-container" style = {{
                                position: "absolute",
                                right: "0px",
                                // transition: "all 1s ease-in-out",
                                zIndex: 3 ,
                                display:  selectedDropDownId === item.id ? "block" : "none",
                                top: selectedDropDownId === item.id ? "30px" : "-500px"
                            }}>
                                <ul>
                                    <li><Link to = {apiRouting.goal.edit.replace(":id", item.id)}>{Strings.edit}</Link></li>
                                    <li><Link to = {apiRouting.goal.dailyProcess.view.replace(":id", item.id)}>{Strings.viewDailyProcess}</Link></li>
                                    <li><Link to = {apiRouting.goal.dailyProcess.update.replace(":id", item.id)}>{Strings.updateDailyProgress}</Link></li>
                                       <li className ="delete-button" onClick = {() => onActionValueChange(goalListDropDownOption.delete, item.id, item.goalTracker)}>{Strings.delete}</li>
                                </ul>
                            </div>
                            </div>
                            <div className='date-container'>
                                <Typography component="span" >{item.startDate}</Typography>
                                <Typography component="span" >To</Typography>
                                <Typography component="span" >{item.dueDate}</Typography>
                            </div>
                            </div>
                            <div style = {{
                                background: setBackground(calculateGoalProcess(item.totalDays, item.goalTracker))
                            }} className='process'>
                                <Typography component="span" >Process : {calculateGoalProcess(item.totalDays, item.goalTracker)}%</Typography>
                            </div>
                      
                        </div>    
                    )
                    })
                )  : <Box>No found</Box>}
            </div>

        </div>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box  gridColumn = {12}>
                
              
            </Box>
            <Box gridColumn = {12} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              
    </Box>
    </Box>
        </>
    ) 
}

export default Goals
