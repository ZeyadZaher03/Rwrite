authintication()
const uid = Cookies.get("uid");
if (uid) {
    db.ref(`users/${uid}/isAdmin`).once("value", (snapshot) => {
        if (snapshot.val()) menuNavigationSwitch("admin")
        else menuNavigationSwitch("user")
    })
} else {
    menuNavigationSwitch("guest")
}

const contactMessage = ()=>{
    const contactForm = document.querySelector(".contact-us-form")
    const name = contactForm["name"]
    const phoneNumber = contactForm["phoneNumber"]
    const email = contactForm["email"]
    const message = contactForm["message"]
    const sendMessage = document.querySelector("#send-contact-message-button")
    
    const runSendContactMessage  = () => {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault()
        })
        
        sendMessage.addEventListener("click", (e) => {
            e.preventDefault()
        
            let emptyInputs = 0
        
            if (!name.value.trim()) emptyInputs++
            if (!phoneNumber.value.trim()) emptyInputs++
            if (!email.value.trim()) emptyInputs++
            if (!message.value.trim()) emptyInputs++
        
            if (emptyInputs !== 0) {
                displayMessage("topCenter", "error", "Please Fillup All The Input Before Submitting", 3000)
                return
            }
        
            const messageObj = {
                name: name.value,
                phoneNumber: phoneNumber.value,
                email: email.value,
                message: message.value,
            }
        
            db.ref(`messages`).push(messageObj)
            
            console.log(messageObj)
            contactForm.reset()
            displayMessage("topCenter", "success", "Message has been send successfully", 3000)
            Email.send({
                Host : "smtp.sendgrid.com",
                SecureToken: "ed9c86d7-8655-49fd-b860-04abd4a85c9a",
                To : 'zeyadzaher02@gmail.com',
                From : messageObj.email,
                Subject : `${messageObj.name} Want to send you a message!`,
                Body : `${messageObj.message}, --- phone number: ${messageObj.phoneNumber}`
            })
        })
    }
    
    const phoneNumberValidation = ()=>{
        phoneNumber.addEventListener("keydown", (e) => {
            const allowedKeys = ["+", "Control", "Alt", "Shift", "Backspace"]
            if (!isNaN(e.key) || allowedKeys.includes(e.key)) return
            e.preventDefault()
        })
    }
    
    runSendContactMessage()
    phoneNumberValidation()
}

contactMessage()


