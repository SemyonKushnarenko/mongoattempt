window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.sidenav-trigger').sideNav()
})

document.querySelectorAll('.price').forEach(price => {
    price.textContent = toCurrency(price.textContent)
})

document.addEventListener('DOMContentLoaded', function() {
    M.Sidenav.init(document.querySelector('.sidenav'));
    M.Tabs.init(document.querySelectorAll('.tabs'))
});


function toCurrency(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(price)
}