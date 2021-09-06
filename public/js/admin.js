const serviceForm = document.querySelector('#add-service')
const serviceName = document.querySelector('#service-name')
const description = document.querySelector('#desc')
const cost = document.querySelector('#cost')

serviceForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const body = {
        name: serviceName.value,
        description: description.value,
        cost: cost.value
    }

    fetch('services/', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        response.json().then((data) => {
            console.log(data)
        })
    })
})