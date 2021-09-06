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