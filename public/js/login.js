const loginForm = document.querySelector('form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const body = {
        email: email.value,
        password: password.value
    }

    fetch('/suppliers/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then((response) => {
        response.json().then((data) => {
            if(!data.error) {
                sessionStorage.setItem('authToken', data.token)
                sessionStorage.setItem('supplier', JSON.stringify(data.supplier))

                window.location.href = '/'
            }
        })
    })
})