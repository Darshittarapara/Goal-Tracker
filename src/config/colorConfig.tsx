const config = {
    baseURL: "",
    endPoint: "/random"
}
if (process.env.REACT_APP_COLOR_BASE_URL) {
    config["baseURL"] = process.env.REACT_APP_COLOR_BASE_URL
}
export const { baseURL, endPoint } = config