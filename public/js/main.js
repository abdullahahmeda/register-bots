/* if (location.hash == '#step-2') {
    document.getElementById('accept_tos_error').classList.add('hidden');
    document.querySelector('.steps-wrapper').classList.add('next-step');
} */

function nextStep() {
    if (document.getElementById('accept_tos').checked) {
        location.replace('/register');
    }
    else {
        document.getElementById('accept_tos_error').classList.remove('hidden');
    }
}