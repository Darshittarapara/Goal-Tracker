import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { addDataToFirebaseStore, getDocsFromFirebase, updateDocsToFirebaseStore } from "../../Firebase/service";
import { Strings } from 'config/Strings';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { apiRouting } from 'config/apiRouting';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import { GOALS, TOKEN_KEY, goalListDropDownOption } from 'helper/storage';
import { StringifyOptions } from 'querystring';
import { useGoalContext } from 'context/GoalContext/GoalContext';

/**Change any */
interface GoalProcessList {
    value: number;
    title: string;
}
const DashboardContext = createContext<DashboardContextValues>({
    goalsProcessList: []
});

interface DashboardContextValues {
    goalsProcessList: GoalProcessList[]
}
interface AuthContextComponentProvider {
    children: React.ReactElement
};


export interface AddGoalsPayload {
    startDate: string;
    dueDate: string;
    archiveSteps: string;
    name: string
    goalTracker: string
    priority: string;
}
const DashboardContextProvider: React.FC<AuthContextComponentProvider> = ({
    children
}) => {

    const { getAllGoals, goals, filterList, calculateGoalProcess } = useGoalContext();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        getAllGoals(GOALS + token)
    }, [getAllGoals])

    /**First this will collect the high priority task and calculate it */
    const goalProgressList = filterList?.map((data) => {
        const progress = calculateGoalProcess(data?.totalDays, data?.goalTracker);
        return { value: progress, title: data?.name }
    });
    const dashboardContextValue = {
        goalsProcessList: goalProgressList
    }

    return <DashboardContext.Provider value={dashboardContextValue}>
        {children}
    </DashboardContext.Provider>
}
export const useDashboardContext = () => {
    return useContext(DashboardContext)
}

export default DashboardContextProvider
