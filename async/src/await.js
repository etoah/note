import fetch from 'node-fetch';
(async function (){
    let result= await fetch('https://api.github.com/users/etoah');
    let json =await result.json();
    console.log("result:",json);
})();


(async function (){
    try{
        let result= await fetch('https://api.3github.com/users/etoah');
        let json =await result.json();
        console.log("result:",json);
    }
    catch(ex){
        console.warn("warn:",ex);
    }
})()

