import React, { createContext, useContext, useState } from 'react'
import { addDataToFirebaseStore } from "../../Firebase/service";
import { Strings } from 'config/Strings';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { apiRouting } from 'config/apiRouting';

/**Change any */
const GoalContext = createContext<GoalsContextProps>({
    goals: [],
    isLoading: false,
    onAddGoal: (payload: AddGoalsPayload, path: string) => { }
});

interface GoalsContextProps extends GoalReducerState {
    onAddGoal: (payload: AddGoalsPayload, path: string) => void
}
interface AuthContextComponentProvider {
    children: React.ReactElement
};

interface GoalReducerState {
    goals: any[];
    isLoading: boolean
}
interface AddGoalsPayload {
    startDate: string;
    dueDate: string;
    archiveSteps: string;
    name: string
    goalTracker: {
        id: number;
        isCompleted: boolean
    }
    priority: string;
}
const GoalContextProvider: React.FC<AuthContextComponentProvider> = ({
    children
}) => {
    const [state, setState] = useState<GoalReducerState>({
        goals: [],
        isLoading: false
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

    /**
     * This function store the user data in a firebase storage with a unique Id
     * @param payload
     * @param path 
     */
    const addGoalToFirebase = async (payload: AddGoalsPayload, path: string) => {
        setState({
            ...state,
            isLoading: true
        })
        const { data, differentDays } = calculateGoalTrackerData(payload.startDate, payload.dueDate, payload.name)
        const newPayload = {
            ...payload,
            goalTracker: JSON.stringify(data),
            totalDays: differentDays
        }

        const response = await addDataToFirebaseStore(path, newPayload);
        const error = response as { error: string }
        setState({
            ...state,
            isLoading: false
        })
        if (!error?.error) {
            Swal.fire({
                title: 'Success',
                text: Strings.yourGoalSuccessFullyAdded,
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: Strings.goToGoals,
                cancelButtonText: Strings.cancel,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33"
            }).then((res) => {
                if (res.isConfirmed) {
                    navigator(apiRouting.goal.list)
                }
            })
        } else {
            Swal.fire({
                title: 'Error!',
                text: error?.error as unknown as string,
                icon: 'error',
                cancelButtonText: Strings.ok
            })

        }
    }
    const goalContextValue = {
        isLoading: state.isLoading,
        goals: state.goals,
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