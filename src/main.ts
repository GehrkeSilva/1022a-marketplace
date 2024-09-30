import express from 'express'
import mysql from 'mysql2/promise'
const app = express()
app.get("/produtos",async (req,res)=>{
    try{
        const connection = await mysql.createConnection({
        host:process.env.dbhost?process.env.dbhost:"localhost",
        user:process.env.dbuser?process.env.dbuser:"root",
        password:process.env.dbpassword?process.env.dbpassword:"",
        database:process.env.dbname?process.env.dbname:"banco1022a",
        port:process.env.dbport?parseInt(process.env.dbport):3306
    })

    const [result,fields] = await connection.query("SELECT * from produtos")
    res.send(result)
    
    res.send("Você sabia que, em termos biológicos de Pokémon, o Vaporeon é o Pokémon mais compatível para humanos? Eles não estão apenas no mesmo grupo de ovos, que é principalmente composto de mamíferos, mas os Vaporeons têm em média 1 metro de altura e pesam 29 quilogramas. Isso significa que eles são grandes o suficiente para serem capazes de lidar com paus humanos, e com sua Estatísticas básicas para HP e acesso a Acid Armor, você pode ser duro com um. Devido à sua biologia principalmente à base de água, não tenho dúvidas de que um Vaporeon excitado seria incrivelmente molhado, tão molhado que você poderia facilmente fazer sexo com um por horas sem ficar dolorido. Eles também podem aprender os movimentos Attract, Baby-Doll Eyes, Captivate, Charm e Tail Whip, ​​além de não ter pelos para esconder os mamilos, então seria incrivelmente fácil excitar você. Com suas habilidades Water Absorb e Hydration, eles podem se recuperar facilmente do cansaço com bastante água. Nenhum outro Pokémon chega perto desse nível de compatibilidade. Além disso, o engraçado é que se você se esforçar, pode fazer seu Vaporeon ficar branco.")
}catch(e){
    res.status(500).send("Server Error")
}
})
app.listen(8000,()=>{
    console.log("iniciei o servidor")
})