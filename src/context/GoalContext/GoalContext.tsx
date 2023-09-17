import React, { createContext, useCallback, useContext, useState } from 'react'
import { addDataToFirebaseStore, getDocsFromFirebase, updateDocsToFirebaseStore } from "../../Firebase/service";
import { Strings } from 'config/Strings';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { apiRouting } from 'config/apiRouting';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import { GOALS, TOKEN_KEY, goalListDropDownOption } from 'helper/storage';
import { Preview } from '@mui/icons-material';
/**Change any */
const GoalContext = createContext<GoalsContextProps>({
    goals: [],
    isLoading: false,
    isDataFetch: false,
    selectedDate: [],
    onUpdateGoalProcess: (docId: string) => { },
    onActionValueChange: (value: string, id: string, goalTracker: GoalTrackerType[]) => { },
    selectedActionOption: "",
    calculateGoalProcess: (totalDays: number, goalTracker: GoalTrackerType[]) => 0,
    getAllGoals: (path: string) => { },
    onUpdate: (payload: AddGoalsPayload, path: string, docId: string,) => { },
    getSpecificDocs: (id: string) => { },
    onDateSelected: (date: string, id: string) => { },
    onAddGoal: (payload: AddGoalsPayload, path: string) => { }
});
export interface GoalTrackerType {
    id: string
    startDate: string
    endDate: string
    isCompleted: boolean
}
export interface GoalsStateFields {
    startDate: string;
    id: string;
    dueDate: string;
    archiveSteps: string;
    name: string
    goalTracker: GoalTrackerType[]
    totalDays: number;
    priority: string;
}
interface GoalsContextProps extends GoalReducerState {
    getSpecificDocs: (id: string) => any
    onUpdateGoalProcess: (docId: string) => void,
    onActionValueChange: (value: string, id: string, goalTracker: GoalTrackerType[]) => void
    selectedActionOption: string
    selectedDate: string[]
    onDateSelected: (date: string, id: string) => void,
    onAddGoal: (payload: AddGoalsPayload, path: string) => void
    calculateGoalProcess: (totalDays: number, goalTracker: GoalTrackerType[]) => number
    getAllGoals: (path: string) => void
    onUpdate: (payload: AddGoalsPayload, path: string, docId: string,) => void
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
    const [selectedActionOption] = useState("");
    const navigator = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string[]>([])
    const calculateGoalProcess = (totalDays: number, goalTracker: GoalTrackerType[]) => {
        if (!Array.isArray(goalTracker)) return 0
        const completedGoals = goalTracker.filter((item) => item.isCompleted);
        const completedDays = completedGoals.length;

        if (completedDays === 0) {
            return 0; // or handle the case where there are no completed days as needed
        }

        const process = (completedDays / totalDays) * 100
        return process > 100 ? 100 : Number(process.toFixed(1))
    }
    /**
     * This updated the date which user select in update daily process
     * @param date 
     */
    const handlerDateCalenderSelected = (date: string, id: string) => {
        setState((preViewState) => {
            return {
                ...preViewState,
                goals: duplicateGoals,
                isLoading: true,
            }
        })
        if (!selectedDate.includes(date)) {
            setSelectedDate([...selectedDate, date])
        }
        const duplicateGoals = [...state.goals]
        const newGoals: GoalsStateFields = state.goals.find((item) => item.id === id);
        const newGoalsIndex = state.goals.findIndex((item) => item.id === id);
        const goalTracker = typeof (newGoals.goalTracker) === "string" ? JSON.parse(newGoals.goalTracker) : newGoals.goalTracker
        const newGoalTracker = goalTracker?.map((data: { startDate: string; isCompleted: boolean; }) => {
            if (data?.startDate === date) {
                return {
                    ...data,
                    isCompleted: !data?.isCompleted
                }
            }
            return data
        })
        newGoals.goalTracker = [...newGoalTracker];
        duplicateGoals[newGoalsIndex] = newGoals;
        setState((preViewState) => {
            return {
                ...preViewState,
                goals: duplicateGoals,
                isLoading: false
            }
        })

    }
    const handlerCompletedTodayFieldInFirebase = async (docId: string) => {
        setState((previewState) => {
            return {
                ...previewState,
                isLoading: true
            }
        })
        const newGoalData = state.goals.find((item) => item.id === docId)
        newGoalData.goalTracker = JSON.stringify(newGoalData.goalTracker)
        const token = localStorage.getItem(TOKEN_KEY)
        await updateDocsToFirebaseStore(GOALS + token, docId, newGoalData);
        await getDocsFromFirebase(GOALS + token)

        setState((previewState) => {
            return {
                ...previewState,
                isLoading: false
            }
        })

    }

    const deleteDocFromFirebase = async (docId: string) => {
        const path = GOALS + localStorage.getItem(TOKEN_KEY);
        await deleteDoc(doc(db, path, docId));
        await getGoalListFromFirebase(path)
    }
    const handlerActionButtonSelectInputChange = (value: string, id: string, goalTracker: GoalTrackerType[]) => {
        if (value === goalListDropDownOption.edit) {
            navigator(`${apiRouting.goal.edit.replace(":id", id)}`)
        }
        if (value === goalListDropDownOption.delete) {
            Swal.fire({
                title: "",
                icon: 'warning',
                text: Strings.areYouWantToDeleteThisGoal,
                confirmButtonText: Strings.delete,
                showCancelButton: true,
                cancelButtonText: Strings.cancel,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33"
            }).then((res) => {
                if (res.isConfirmed) {
                    deleteDocFromFirebase(id)
                }
            })
        }
        if (value === goalListDropDownOption.viewDailyProgress) {
            navigator(apiRouting.goal.dailyProcess.view.replace(":id", id));
        }
        if (value === goalListDropDownOption.updateDailyProgress) {
            navigator(apiRouting.goal.dailyProcess.update.replace(":id", id));
        }
    }
    /**
   * Generate the goal tracker loop
   * @param {string} startDate
   * @param {string} endDate
   * @param {string} name
   * @return {Array<{id: string, isCompleted: boolean, startDate: string, endDate: string}>}
   */
    const calculateGoalTrackerData = (startDate: string, endDate: string, name: string, docId = "") => {
        let data = [];
        const initialDate = moment(startDate, 'DD.MM.YYYY');
        const differentDays = moment(endDate, 'DD.MM.YYYY').diff(initialDate, 'days');

        for (let i = 0; i <= differentDays; i++) {
            const currentDate = moment(initialDate).add(i, 'days');
            data.push({
                id: `${name?.replaceAll(" ", "")}${i + 1}`,
                startDate: currentDate.format('YYYY-MM-DD'),
                endDate: currentDate.format('YYYY-MM-DD'),
                isCompleted: docId ? setPreviousGoalCompletedValue(currentDate.format('YYYY-MM-DD'), docId) : false,
            });
        }

        return { data, differentDays };
    };

    const setPreviousGoalCompletedValue = (date: string, docId: string) => {
        const previousGoals = state.goals.find((item) => item.id === docId)?.goalTracker;
        const newGoalTracker: GoalTrackerType = previousGoals?.find((item: { startDate: string; }) => item.startDate === date);
        console.log(date, newGoalTracker);
        if (newGoalTracker) {
            return newGoalTracker?.isCompleted
        }
        return false
    }
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

    }, [navigator])
    /**
     * @param {string} Documents path
     * This will get the list from firebase base on a PATH
     */
    const getGoalListFromFirebase = useCallback(async (path: string) => {
        setState((preViewState) => {
            return {
                ...preViewState,
                isLoading: true
            }
        })
        const data: AddGoalsPayload[] = await getDocsFromFirebase(path);
        if (data?.length > 0) {
            const newGoal = data?.map((item) => {
                return {
                    ...item,
                    goalTracker: typeof (item.goalTracker) !== "string" ? item.goalTracker : JSON.parse(item.goalTracker)
                }
            });
            setState((preViewState) => {
                return {
                    ...preViewState,
                    isLoading: false,
                    goals: newGoal
                }
            })
            return
        }
        setState((preViewState) => {
            return {
                ...preViewState,
                isLoading: false,
                goals: []
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

        const { data, differentDays } = calculateGoalTrackerData(payload.startDate, payload.dueDate, payload.name, docId);
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
        selectedDate,
        calculateGoalProcess,
        getAllGoals: getGoalListFromFirebase,
        selectedActionOption,
        onActionValueChange: handlerActionButtonSelectInputChange,
        onUpdate: updateGoalToFirebase,
        onAddGoal: addGoalToFirebase,
        onUpdateGoalProcess: handlerCompletedTodayFieldInFirebase,
        onDateSelected: handlerDateCalenderSelected
    }

    return <GoalContext.Provider value={goalContextValue}>
        {children}
    </GoalContext.Provider>
}
export const useGoalContext = () => {
    return useContext(GoalContext)
}

export default GoalContextProvider
