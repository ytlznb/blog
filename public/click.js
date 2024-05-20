
function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "/all";
        } else {
            alert("登录失败")
        }
        document.getElementById("login-username").value="";
	    document.getElementById("login-password").value="";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password}),
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.success) {
            
           alert("注册成功");

        } else {
            
            alert("注册失败");

        }
        document.getElementById("register-username").value="";
	    document.getElementById("register-password").value="";
	    document.getElementById("register-email").value="";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

