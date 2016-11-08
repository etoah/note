import fetch from 'node-fetch'
fetch('https://api.github.com/users/etoah')
.then((res)=>res.json())
.then((json)=>console.log("json:",json))