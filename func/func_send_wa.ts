export const funcSendWa = async (data: any[]) => {
    return fetch('/api/wea', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
}