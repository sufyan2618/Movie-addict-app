export const API_URL = "http://10.0.2.2:7000/api"

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
