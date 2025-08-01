
export const formatePostDate = (dateString) => {
    const newDate = new Date(dateString)
    const month = newDate.toLocaleString("default", {month: "long"})
    const day = newDate.getDay();
    const year = newDate.getFullYear();
    return `${month} ${day}, ${year}`
}

formatePostDate();