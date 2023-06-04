export default async function cekWa(req: any, res: any) {
    // Replace with the phone number you want to check
    const phoneNumber = "+6289697338821";

    // Send a GET request to the WhatsApp API to check if the phone number is valid
    await fetch(`https://api.whatsapp.com/v2/users/${phoneNumber}`)
        .then(response => {
            if (response.status === 200) {
                console.log(`Phone number ${phoneNumber} is associated with a WhatsApp account`);
            } else if (response.status === 404) {
                console.log(`Phone number ${phoneNumber} is not associated with a WhatsApp account`);
            } else {
                console.log(`Error checking phone number: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error(`Error checking phone number: ${error}`);
        });

    res.status(200).send("ok")
}