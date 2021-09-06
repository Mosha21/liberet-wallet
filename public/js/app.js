const rechargeForm = document.querySelector('#credit-recharge')
const amount = document.querySelector('#credit-amount')
const servicesList = document.getElementById('services')
const walletList = document.getElementById('wallet-history')

const services = JSON.parse(sessionStorage.getItem('services'))
const supplier = JSON.parse(sessionStorage.getItem('supplier'))

function useService(id) {
    console.log('Oliss')
    // fetch('/services/' + id, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    //     }
    // }).then((response) => {
    //     response.json().then((data) => {
    //         if(!data.error) {
    //             sessionStorage.setItem('authToken', data.token)
    //             sessionStorage.setItem('supplier', JSON.stringify(data.supplier))

    //             window.location.href = '/'
    //         }
    //     })
    // })
}

services.forEach(service => {
    let node = document.createElement("LI")
    let a = document.createElement("a");
    let text = document.createTextNode(service.name)
    a.appendChild(text)
    a.addEventListener("click", useService(service._id), false)
    node.appendChild(a)
    
    servicesList.appendChild(node)
});

supplier.wallet.events.forEach(event => {
    let node = document.createElement("LI")
    let text = 'Used ' + event.event + ' - ' + event.date
    let textNode = document.createTextNode(text)
    node.appendChild(textNode)
    
    walletList.appendChild(node)
});

rechargeForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const body = {
        amount: amount.value
    }

    fetch('/suppliers/me/wallet/recharge', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((response) => {
        response.json().then((supplier) => {
            sessionStorage.setItem('supplier', supplier)
            amount.value = ''
            location.reload()
        })
    })
})