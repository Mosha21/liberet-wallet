const supplier = JSON.parse(sessionStorage.getItem('supplier'))
if(!supplier.admin) document.getElementById("admin").style.display = "block"

fetch('suppliers/me', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    }
}).then(response => {
    if(response.status === 200) {
        response.json().then(data => {
            document.getElementById('name').innerHTML = 'Welcome ' + data.supplier.name
            document.getElementById('credits').innerHTML = 'Credits: ' + data.supplier.credits
            sessionStorage.setItem('supplier', JSON.stringify(data.supplier))
        })
    } else {
        if(window.location.pathname !== '/login') window.location.href = '/login'
    }
})

fetch('services', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    }
}).then(response => {
    if(response.status === 200) {
        response.json().then(services => {
            sessionStorage.setItem('services', JSON.stringify(services))
        })
    } else {
        if(window.location.pathname !== '/login') window.location.href = '/login'
    }
})