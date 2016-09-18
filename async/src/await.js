import fetch from 'isomorphic-fetch';

(async function (){
    let result= await fetch('https://api.github.com/users/etoah');
    let json =await result.json();
    console.log("result:",json);
})();

// parallel
(async function (){
    let result= await Promise.all([
         (await fetch('https://api.github.com/users/tj')).json(),
         (await fetch('https://api.github.com/users/etoah')).json()
        ]);
    console.log("result:",result);
})();


//exception
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

