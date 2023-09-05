import React, { createContext, useCallback, useContext, useState } from 'react'
import { addDataToFirebaseStore, updateDocsToFirebaseStore } from "../../Firebase/service";
import { Strings } from 'config/Strings';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { apiRouting } from 'config/apiRouting';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import { GOALS, TOKEN_KEY } from 'helper/storage';

/**Change any */
const GoalContext = createContext<GoalsContextProps>({
    goals: [],
    isLoading: false,
    isDataFetch: false,
    onUpdate: (payload: AddGoalsPayload, path: string, docId: string,) => { },
    getSpecificDocs: (id: string) => { },
    onAddGoal: (payload: AddGoalsPayload, path: string) => { }
});

interface GoalsContextProps extends GoalReducerState {
    getSpecificDocs: (id: string) => any
    onUpdate: (payload: AddGoalsPayload, path: string, docId: string,) => void
    onAddGoal: (payload: AddGoalsPayload, path: string) => void
}
interface AuthContextComponentProvider {
    children: React.ReactElement
};

interface GoalReducerState {
    goals: any[];
    isLoading: boolean,
    isDataFetch: boolean
}
export interface AddGoalsPayload {
    startDate: string;
    dueDate: string;
    archiveSteps: string;
    name: string
    goalTracker: string
    priority: string;
}
const GoalContextProvider: React.FC<AuthContextComponentProvider> = ({
    children
}) => {
    const [state, setState] = useState<GoalReducerState>({
        goals: [],
        isLoading: false,
        isDataFetch: false,
    })
    const navigator = useNavigate();

    /**
   * Generate the goal tracker loop
   * @param {string} startDate
   * @param {string} endDate
   * @param {string} name
   * @return {Array<{id: string, isCompleted: boolean, startDate: string, endDate: string}>}
   */
    const calculateGoalTrackerData = (startDate: string, endDate: string, name: string) => {
        const data = [];
        const initialDate = moment(startDate, 'DD.MM.YYYY');
        const differentDays = moment(endDate, 'DD.MM.YYYY').diff(initialDate, 'days');

        for (let i = 0; i <= differentDays; i++) {
            const currentDate = moment(initialDate).add(i, 'days');
            data.push({
                id: `${name?.replaceAll(" ", "")}${i + 1}`,
                startDate: currentDate.format('YYYY-MM-DD'),
                endDate: currentDate.format('YYYY-MM-DD'),
                isCompleted: false,
            });
        }
        return { data, differentDays };
    };

    const getSpecificDocs = useCallback(async (docId: string) => {
        const token = localStorage.getItem(TOKEN_KEY)
        setState((preViewState) => {
            return {
                ...preViewState,
                isDataFetch: true
            }
        });
        const response = await getDoc(doc(db, `${GOALS}${token}`, docId));
        setState((preViewState) => {
            return {
                ...preViewState,
                isDataFetch: false
            }
        });
        if (response.exists()) {
            return response.data()
        }
        Swal.fire({
            title: "Error!",
            text: Strings.goalNotFound,
            icon: "error",
            confirmButtonText: Strings.ok
        }).then((res) => {
            if (res.isConfirmed) {
                navigator(apiRouting.goal.list);
            }
        })

    }, [])

    const performFirebaseOperation = async (
        payload: AddGoalsPayload,
        path: string,
        operationType: 'update' | 'add',
        docId?: string
    ) => {
        setState({
            ...state,
            isLoading: true
        });

        const { data, differentDays } = calculateGoalTrackerData(payload.startDate, payload.dueDate, payload.name);
        const newPayload = {
            ...payload,
            goalTracker: JSON.stringify(data),
            totalDays: differentDays
        };

        let response;

        if (operationType === 'update') {
            response = await updateDocsToFirebaseStore(path, docId as string, newPayload);
        } else if (operationType === 'add') {
            response = await addDataToFirebaseStore(path, newPayload);
        }

        const error = response as { error: string };

        setState({
            ...state,
            isLoading: false
        });

        if (!error?.error) {
            Swal.fire({
                title: 'Success',
                text: operationType === 'update' ? Strings.yourGoalSuccussFullyUpdated : Strings.yourGoalSuccessFullyAdded,
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: Strings.goToGoals,
                cancelButtonText: Strings.cancel,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33"
            }).then((res) => {
                if (res.isConfirmed) {
                    navigator(apiRouting.goal.list);
                }
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: error?.error as unknown as string,
                icon: 'error',
                cancelButtonText: Strings.ok
            });
        }
    };

    const updateGoalToFirebase = async (
        payload: AddGoalsPayload,
        path: string,
        docId: string
    ) => {
        performFirebaseOperation(payload, path, 'update', docId);
    };

    const addGoalToFirebase = async (
        payload: AddGoalsPayload,
        path: string
    ) => {
        performFirebaseOperation(payload, path, 'add');
    };

    const goalContextValue = {
        isLoading: state.isLoading,
        goals: state.goals,
        isDataFetch: state.isDataFetch,
        getSpecificDocs,
        onUpdate: updateGoalToFirebase,
        onAddGoal: addGoalToFirebase
    }

    return <GoalContext.Provider value={goalContextValue}>
        {children}
    </GoalContext.Provider>
}
export const useGoalContext = () => {
    return useContext(GoalContext)
}

export default GoalContextProvider