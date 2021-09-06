const rechargeForm = document.querySelector('#credit-recharge')
const amount = document.querySelector('#credit-amount')
const servicesList = document.getElementById('services')
const walletList = document.getElementById('wallet-history')
const campaignButton = document.getElementById('campaign-button')

const services = JSON.parse(sessionStorage.getItem('services'))
const supplierObject = JSON.parse(sessionStorage.getItem('supplier'))

if(supplierObject.campaign) campaignButton.textContent = 'Desactivar'
else campaignButton.textContent = 'Activar'

function useCampaign() {
    fetch('services/campaign', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        }
    }).then((response) => {
        response.json().then((supplier) => {
            if(supplier) {
                sessionStorage.setItem('supplier', JSON.stringify(supplier))

                window.location.href = '/'
            }
        })
    })
}

function useService(id) {
    fetch('services/' + id, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        }
    }).then((response) => {
        if(response.redirected) return alert('Not enough credits')
        response.json().then((supplier) => {
            if(supplier) {
                sessionStorage.setItem('supplier', JSON.stringify(supplier))

                window.location.href = '/'
            }
        })
    })
}

services.forEach(service => {
    let node = document.createElement("LI")
    let button = document.createElement("button");
    let text = document.createTextNode(service.name + ' (' + service.cost + ' credits)')
    button.appendChild(text)
    button.addEventListener('click', function() {
        useService(service._id)
    })
    node.appendChild(button)
    
    servicesList.appendChild(node)
});

supplierObject.wallet.events.forEach(event => {
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
            sessionStorage.setItem('supplier', JSON.stringify(supplier))
            amount.value = ''
            location.reload()
        })
    })
})