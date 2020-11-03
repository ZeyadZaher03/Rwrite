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
        
        
            displayMessage("topCenter", "success", "Message has been sent successfully", 3000)
            console.log(messageObj)
            contactForm.reset()
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