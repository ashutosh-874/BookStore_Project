function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ===============FORM SUBMISSION=================
let user_form = document.getElementById('user-info-form')
user_form.reset()

const validate_email = (email) => {
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.value.match(mailformat)){
        return true
    }
    return false
}
const validate_phone = (phone) => {
    let valid_phone = /^\d{10}$/;
    if(phone.value.match(valid_phone)){
        return true
    }
    return false
}

const validate_form = (e) => {
    let name = document.getElementById('name')
    let email = document.getElementById('email')
    let mobile = document.getElementById('mobile')

    if(!(name.value.length > 3 && validate_email(email) && validate_phone(mobile))){
        e.preventDefault()
        document.getElementById('error-message').removeAttribute('hidden')
    }
       
}
user_form.addEventListener('submit', validate_form)

// ==============FORM SUBMISSION END=================


// ===============Custom Alert=======================

const alertBox=document.querySelector(".alert-box");
const closeBtn=document.querySelector(".close-alert")     
let timer;

        
closeBtn.addEventListener("click",function () {
    hideAlertBox();
    clearTimeout(timer);
})

function showAlertBox(){
alertBox.classList.remove("hide");
alertBox.classList.add("show");
// hide animation onload 
if(alertBox.classList.contains("hidden")){
    alertBox.classList.remove("hidden");
}
timer=setTimeout(function(){
    hideAlertBox();
},5000)
}

function hideAlertBox(){
alertBox.classList.remove("show");
alertBox.classList.add("hide");
}

// ==================CUSTOM ALERT==============

// ===================APPLY COUPON=====================


const apply_coupon = async() => {
    let url = 'http://127.0.0.1:8000/apply-coupon/'
    const csrftoken = getCookie('csrftoken');
    let code = document.getElementById('coupon_input').value
    console.log(code)
    if(code.length < 1){
        return
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'coupon': code
            }),
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
        if(response.ok){
            const jsonResponse = await response.json()
            console.log(jsonResponse)
            let coupon_applied_div = document.getElementById('coupon-applied-div')
            if(jsonResponse.discount){
                coupon_applied_div.innerHTML = `₹ ${jsonResponse.discount} coupon applied Successfully`
                coupon_applied_div.classList.add('success-color')
                coupon_applied_div.classList.remove('failure-color')

                document.getElementById('price').innerHTML = `499 - ₹ ${jsonResponse.discount} = ₹ ${499-jsonResponse.discount}`
            }
            else{
                coupon_applied_div.innerHTML = `Invalid Coupon`
                coupon_applied_div.classList.add('failure-color')
                coupon_applied_div.classList.remove('success-color')
            }
        }
        else{
            const jsonResponse = await response.json()
            console.log(jsonResponse)  
        }
    } catch (error) {
        console.log('Error', error)
    }
}
let apply_coupon_btn = document.getElementById('apply-coupon')
apply_coupon_btn.addEventListener('click',apply_coupon)