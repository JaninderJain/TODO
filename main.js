const add_btn=document.querySelector(".add-task");
const task_input= document.querySelector(".input_task");
const date= document.querySelector(".date");
const todo_list= document.querySelector(".todo_body");
const alert_message= document.querySelector(".alert-msg");
const completed_list=document.querySelector("completed-List");
const description= document.querySelector(".description");
const category= document.querySelector("#category");
const filter1 = document.querySelector('.filter1');
const src = document.querySelector('#search');
const current= new Date();
const currentyear= current.getFullYear();
const currentmonth=current.getMonth()+1;
const currentdate= current.getDate();


function Dofilter(e){
    filter(filter1.value);
}

//let todos=[];
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let completedtodo=[];


window.addEventListener("DOMContentLoaded",()=>{
    showAlltodo();
    if(!todos.length){
        displayTodos([]);
    }
})

function search(){
    //console.log(src.value);
    const todo = todos.filter((ele) => {
        //console.log(ele.task)
        if(ele.task.includes(src.value)){
            return true;
        }
    })

    showAlltodo(todo , 1);
}

function sort(type){
    todos.sort((a , b) => {
        const date1 = new Date(a.duedate);
    const date2 = new Date(b.duedate);
    
    return type == 1 ? date2 - date1 : date1 - date2;
    })
    showAlltodo(todos , 1);
}



add_btn.addEventListener("click" ,()=>{
    if(task_input.value==="" ){
        showAlert("Please enter a task","error");
    }
    else if(date.value===""){
        showAlert("Please a date","error");
    }
    
    else{
        const res = addToDo(task_input, description, date,category);
        showAlltodo();
        task_input.value="";
        description.value="";
        date.value="";
        category.value="Category";
        if(res){
            showAlert("Task added Successfully" , "success");
        }else{
            showAlert("Invalid Date Selection" , "fail")
        
        }

    }
});


function getRandomId(){
    return(
        Math.random().toString(36).substring(2,15)+
        Math.random().toString(36).substring(2,15)
    );
}

function addToDo(task_input,  descript,dt, category){
    
    let task={
        id:getRandomId(),
        task: task_input.value,
        description: descript.value,
        duedate: dt.value,
        category:category.value,
        completed: false,
        status: "Pending",
    };
    if(task.category=="Category"){
        task.category="None";
    }
    const year =task.duedate;
    const rYear = year.split('-')[0];
    const rMonth= year.split('-')[1];
    const rDay= year.split('-')[2];
    if(rYear>currentyear){
        todos.push(task);
        return true;
    }
    else if(rYear==currentyear){
        if(rMonth>currentmonth){
            todos.push(task);
            return true;
        }
        else if(rMonth==currentmonth){
            if(rDay>=currentdate){
                todos.push(task);
                return true;
            }
        }
    }
    else{
        return false;
    }
    
}

function showAlltodo(todo1 = todos, type = 0){
    todo_list.innerHTML="";
    if(todo1.length === 0){
        todo_list.innerHTML=`<tr><td colspan="6" class="text-center"> No task found</td></tr>`;
        return ;
    }
    todo1.forEach((todo)=>{
        todo_list.innerHTML+=`
        <tr data-id="${todo.id}">
            <td>${todo.task}</td>
            <td>${todo.description || "No Description"}</td>
            <td>${todo.duedate}</td>
            <td>${todo.category}</td>
            <td>${todo.status}</td>
            <td>
                <button class="edit-btn" onclick="editTodo('${todo.id}')">
                    <i class="fa-solid fa-pen" style="color: #cc0000;"></i>
                </button>
                <button class="done-btn" onclick="doneTodo('${todo.id}')">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="delete-btn" onclick="delTodo('${todo.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });
    if(type == 0){
        saveToLocal();
    }
    

}

function doneTodo(id){
    let todo= todos.find((todo)=> todo.id===id);
    todo.status="Completed";
    saveToLocal();
    showAlltodo();
}

function delTodo(id){
    todos=todos.filter((todo)=>todo.id !==id);
    saveToLocal();
    showAlert("todo deleted", "success");
    showAlltodo();
}

function editTodo(id){
    let todo= todos.find((todo)=> todo.id===id);
    task_input.value= todo.task;
    description.value = todo.description;
    date.value = todo.duedate;
    category.value = todo.category;
    todos= todos.filter((todo)=> todo.id!==id);
    add_btn.innerHTML="<i class='fa-solid fa-check'></i>";
    saveToLocal();
    add_btn.addEventListener("click", ()=>{
        add_btn.innerHTML="<i class='fa-solid fa-plus ' style='color: #ffffff;'></i>"
        showAlert("updated" , "success");
    })

}

function showAlert(message, type){
    let alert_box=`
    <div>
        <div>
            <span>
                ${message}
            </span>
        </div>
    </div>
    `;
    alert_message.innerHTML= alert_box;
    alert_message.classList.remove("hide");
    alert_message.classList.add("show");
    setTimeout(()=>{
        alert_message.classList.remove("show");
        alert_message.classList.add("hide");
    },3000);
}

function saveToLocal(){
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

function filter(type){
    
    const newList = todos.filter((ele , idx) => {
        if(ele.status == type || type == 'all'){
            return true;
        }
    });

   

    showAlltodo(newList , 1);

}

