let dateString;
let arr;
let nav = 0;
let clicked = null;
const datee=document.getElementById('date');
const body=document.getElementsByTagName('body')[0];
const calendar = document.getElementById('calendar');
const modal=document.getElementById("newEventModal");
const Selection=document.getElementsByClassName('sec')[0];
const datecol=document.getElementById("datecol");
const addteachermodal=document.getElementById("addteachersmodal");
// const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
// const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const addteacher=document.getElementsByClassName("addteacher")[0];
const customselect=document.getElementById("customselect");
const scheduleteacher=document.getElementById("scheduleteacher");
const sorting=document.getElementsByClassName("customselectdesign")[0];
const closeButton=document.getElementById('closeButton');
let eventText=document.getElementById('eventText');
let datevalue;
//buttons
const addbtn=document.getElementsByClassName('saveButton');



const getteacher= ()=> {
    fetch("/getteachers").then((res)=>{
           return res.json();
    }).then((data)=>{
      for(let i=0;i<data.length;i++){
        const option1=document.createElement('option');
        
        option1.innerHTML=data[i].name;
       
        customselect.appendChild(option1);
        
      }
    }).catch((err)=>{
      console.log(err);
    });
     
}


function openModal1(date){
  if(typeof(date)=="string"){
    datevalue=date;
  datee.style.visibility="hidden";
  }
  else{
  datee.style.visibility="visible";
  }
  modal.style.display='flex'
  modalBackDrop.style.display='block';
}
function openModal2(){
  addteachermodal.style.display='flex'
  modalBackDrop.style.display='block';
}


function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;
  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    const  dayString = `${month + 1}/${i - paddingDays}/${year}`;

let event;

      
    if (i > paddingDays){
      daySquare.innerText = i - paddingDays;
   
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }
   
     
    } else {
      daySquare.classList.add('padding');
    }
    let ans=false;
    arr.find((ele)=>{
      const d=new Date(ele.datee);
      const d1=new Date(dayString);
      if(ele.name==customselect.value &&  d.getDate()==d1.getDate() && d.getMonth()==d1.getMonth() && d.getFullYear() ==d1.getFullYear()){
       ans=true;
        event=ele;
        const element1=document.createElement('div');
        element1.classList.add('event');
        element1.innerHTML=`<div>${event.topic}</div>
        <div>${event.starttime}</div>
        <div>${event.endtime}</div>`
        daySquare.appendChild(element1);
        daySquare.addEventListener('click', () =>{
          if(confirm("Do You Want Schedule Teachers")){
            openModal1(dayString);
          }else{
            deleteEventModal.style.display='block';
            let tempele= document.createElement('div');
            tempele.classList.add('event1');
            tempele.innerHTML=element1.innerHTML;
            eventText.appendChild(tempele);
            modalBackDrop.style.display='block';
          }
        });
      }
      
    })
    if(!ans) daySquare.addEventListener('click', () => openModal1(dayString));

    calendar.appendChild(daySquare);  
    
  }
 
}


function closeModal(){
  newEventModal.style.display = 'none';
  addteachermodal.style.display = 'none';
  backDrop.style.display = 'none';
  load();
}



function removeAllChildNodes(parent){
  
  while(parent.lastElementChild){
      parent.removeChild(parent.lastElementChild);
  }
}



let events;
const getschedule=()=>{
   fetch(`/fetchclasses`).then((res)=>{
    return res.json();
  }).then((data)=>{
    arr=data;
    load();
    removeAllChildNodes(datecol); 
    removeAllChildNodes(namecol);
    removeAllChildNodes(startcol);
    removeAllChildNodes(endcol);               
      for(let i=0;i<data.length;i++){
      const value=data[i];
      const elename=document.createElement("div");
      const elestart=document.createElement("div");
      const eleend=document.createElement("div");
      const eledate=document.createElement("div");
      
      const inpdate=new Date(value.datee);
      elename.classList.add("child");
      elestart.classList.add("child");
      eleend.classList.add("child");
      eledate.classList.add("child");
      elename.innerHTML=value.name;
      elestart.innerHTML=value.starttime;
      eleend.innerHTML=value.endtime;
      eledate.innerHTML=inpdate.getDate();
      namecol.appendChild(elename);
      startcol.appendChild(elestart);
      endcol.appendChild(eleend);
      datecol.appendChild(eledate);
    
  }
    
  }).catch((err)=>{
      console.log(err);
    });

}


function initButtons(){
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
addteacher.addEventListener('click',openModal2);
document.getElementsByClassName('cancelButton')[0].addEventListener('click', closeModal);
document.getElementsByClassName('cancelButton')[1].addEventListener('click', closeModal);
addbutton.addEventListener('click',openModal1);
addbtn[0].addEventListener('click',async()=>{
  if(customselect.value==0){
    alert("select teacher");
  }
  if(starttime.value==0){
    alert("select start time");
  }
  if(endtime.value==0){
    alert("select end time");
  }
  if(endtime.value<starttime.value){
    alert("Time is Wrong");
  }
  if(datevalue==undefined){
    datevalue=dateinp.value;
    if(dateinp.value=="")alert("enter Date");
  }
  const params={
    method:"POST",headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      teachername:customselect.value,
      topic:topic.value,
      classdate:datevalue,
      starttime:starttime.value,
      endtime:endtime.value
    })
  };
 
  if(customselect.value!=0 && starttime.value!=0 && endtime.value!=0 && datevalue!=undefined){
    closeModal();
    try{
  const url="/scheduleteacher"
  const res= await fetch(url,params);
  datevalue=undefined;
  
  }catch(err){
    console.log(err);
  }
}
else{
  alert("can't schedule");
}

})
addbtn[1].addEventListener('click',async()=>{
    try{
    const params={
      method:"POST",headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        teachername:teacher.value
      })
    };
    const url="/addteacher"
    const res= await fetch(url,params);
    getteacher();
  }
  catch(err){
    console.log(err);
  }

});
addteacherdb.addEventListener('click',()=>{
    closeModal();
    load();
   
})
closeButton.addEventListener('click',()=>{
  console.log(eventText);
  removeAllChildNodes(eventText);
  deleteEventModal.style.display='none';
  modalBackDrop.style.display='none';
})
}
getteacher();
initButtons();
getschedule();
customselect.addEventListener('click',load);