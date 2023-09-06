export const apiRouting = {
    home: "/",
    dashboard: "/dashboard",
    goal: {
        list: "/goals",
        add: "goal/add",
        edit: "goal/:id/edit",
        dailyProcess: {
            view: "/goal/:id/view-daily-process"
        }
    }
}