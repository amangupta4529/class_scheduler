const express=require('express');
const path=require('path');
const mysql=require('mysql');



var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:"scheduler"
});
connection.connect((err)=>{
    if(err)console.log(err);
    else console.log("databse connected succesfully");

})
const app=express();
app.use(express.urlencoded({extended:false}));
app.set('view engine','hbs');
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));

const host="localhost";
const port="3000";
app.get('/',(req,res)=>{
    res.render('index.hbs');
})


app.get("/fetchclasses",(req,res)=>{
    const date=new Date(req.query.date);
    const curmonth=date.getMonth();
    const getquery=`select *  from teachersschedule `;
    if(req.query.sort=="day"){
        getquery=`select *  from teachersschedule where datee=date`;
    }
    else if(req.query.sort=="month"){
        getquery=`select *  from teachersschedule where month=curmonth`;
    }
    
    
    connection.query(getquery,(err,response)=>{
        if(err)throw err;
        console.log(response);
        res.send(response);
    })
})


app.get('/getteachers',(req,res)=>{
    
    const getquery=`select distinct name from teachersname `;
    
    connection.query(getquery,(err,response)=>{
        if(err)throw err;
        console.log(response);
        res.send(response);
    })
})
app.post("/addteacher",(req,res)=>{
    console.log((req.body.teachername));
    const tname=req.body.teachername;
    const insertquery=`insert into teachersname (name) values(?)`;
    const query=mysql.format(insertquery,[tname]);
    connection.query(query,(err,response)=>{
        if(err)throw err;
        console.log(response);
    })
});
app.post("/scheduleteacher",(req,res)=>{
    console.log((req.body));
    const body=req.body;
    const topic=body.topic;
    const name=body.teachername;
    const starttime=body.starttime;
    const endtime=body.endtime;
    const date=body.classdate;
    const temp=new Date(date);
    const datee=temp.getDate();
    const month=temp.getMonth();
    const year=temp.getFullYear();
    if(date=='')res.render("index");
    console.log(temp.getDate());
     let ans=true;
    const tempquery=`select * from teachersschedule where name='${name}' and month='${month}' and starttime<='${starttime}' and endtime>='${starttime}' and date='${temp.getDate()}' `;
    connection.query(tempquery,(err,response)=>{
        if(err)throw err;
        if(response.length!=0){
            console.log("cant add");
            ans=false;
            res.end();
        }
    })


     if(ans){
    const insertquery=`insert into teachersschedule (name,topic,month,year,datee,starttime,endtime,date) values(?,?,?,?,?,?,?,?)`;
    const query=mysql.format(insertquery,[name,topic,month,year,temp,starttime,endtime,temp.getDate()]);
    connection.query(query,(err,response)=>{
        if(err)throw err;  
    })
}
   
});


app.listen(port,"localhost",()=>{
    console.log(`connected to the server ${port}`);
});

