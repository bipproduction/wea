export const sendNotifToClient = ({ title, value }: { title: string, value: string }) => {
    fetch(process.env.URL + '/api/socket', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            value: value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

