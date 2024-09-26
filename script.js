const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const modalBtn = document.querySelector(".modal-cont");
const textAreaCont = document.querySelector(".textArea-cont");
const mainCont = document.querySelector(".main-cont");

let storageTicketList = JSON.parse(localStorage.getItem('tickets')) || [];

let addModalFlag = false;
let removeTaskFlag = false;
let modalPriorityColor = "black";

addBtn.addEventListener("click", function () {
  addModalFlag = !addModalFlag;

  if (addModalFlag) modalBtn.style.display = "flex";
  else modalBtn.style.display = "none";
});

modalBtn.addEventListener("keydown", function (e) {
  // if(e.ctrlKey && e.key === 'Shift') modalBtn.style.display = 'none';
  if (e.key === "Shift") {
    modalBtn.style.display = "none";
    const ticketId = shortid();
    let taskContentValue = textAreaCont.value;
    createTicket(modalPriorityColor, taskContentValue, ticketId);
    textAreaCont.value = "";
    storageTicketList.push({
        ticketID: ticketId,
        ticketColor: modalPriorityColor,
        taskContent: taskContentValue,
    })
    updateLocalStorage();
  }
});

function createTicket(modalPriorityColor, textAreaValue, ticketId) {
  const ticketContDiv = document.createElement("div");
  ticketContDiv.classList.add("ticket-cont");

  const ticketHtml = `
            <div class="ticket-color" style="background: ${modalPriorityColor}"></div>
            <div class="ticket-id">${ticketId}</div>
            <div class="ticket-area">${textAreaValue}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `;
  ticketContDiv.innerHTML = ticketHtml;
  mainCont.appendChild(ticketContDiv);
  handleLockFunctionality(ticketContDiv);
  handleColorFunctionality(ticketContDiv);
}

let priorityColors = document.querySelectorAll(".priority-color");

priorityColors.forEach(function (color) {
  color.addEventListener("click", function () {
    priorityColors.forEach(function (currentElem) {
      currentElem.classList.remove("active");
    });
    color.classList.add("active");
    modalPriorityColor = color.getAttribute("data-color");
  });
});

const lockClose = 'fa-lock';
const lockOpen = 'fa-lock-open';

function handleLockFunctionality(ticketElem) {
    const ticketLock = ticketElem.querySelector('.ticket-lock');
    const ticketArea = ticketElem.querySelector('.ticket-area');
    const id = ticketElem.querySelector('.ticket-id').innerText;

    ticketLock.addEventListener('click', function() {
        const currentTicketIdx = getTicketIndex(id);
        if(ticketLock.children[0].classList.contains(lockClose)) {
            ticketLock.children[0].classList.remove(lockClose);
            ticketLock.children[0].classList.add(lockOpen);
            ticketArea.setAttribute('contentEditable', true);
        }
        else  {
            ticketLock.children[0].classList.remove(lockOpen);
            ticketLock.children[0].classList.add(lockClose);
            ticketArea.setAttribute('contentEditable', false);
        }
        storageTicketList[currentTicketIdx].taskContent = ticketArea.innerText;
        updateLocalStorage();
    })
}



removeBtn.addEventListener("click", function () {
    removeTaskFlag = !removeTaskFlag;

    const ticketCont = document.querySelectorAll('.ticket-cont');
    for(let i=0;i<ticketCont.length;i++) {
        handleDelete(ticketCont[i]);
    }
  
    if (removeTaskFlag) {
        alert('Delete button has been activated');
        removeBtn.style.color = 'red';

    }
    else removeBtn.style.color = 'white';
  });

function handleDelete(elementToDelete) {
    const id = elementToDelete.querySelector('.ticket-id').innerText;
    elementToDelete.addEventListener('click', function() {
        if(removeTaskFlag) {
            elementToDelete.remove();
            const ticketIdx = getTicketIndex(id);
            storageTicketList.splice(ticketIdx, 1);
            updateLocalStorage();
        }
        else {
            console.log('else console statement');
        }
    })
}

let colorsElem = ['lightpink', 'lightgreen', 'lightblue', 'black'];

function handleColorFunctionality(ticketElem) {
    const ticketColor = ticketElem.querySelector('.ticket-color');
    const id = ticketElem.querySelector('.ticket-id').innerText;

    ticketColor.addEventListener('click', function() {
        const currentTicketColor = ticketColor.style.background;
        const currentTicketIndex = getTicketIndex(id);

        const currentColorIndex = colorsElem.findIndex(function(color) {
            return color === currentTicketColor;
        })
        const newColorIndex = (currentColorIndex + 1) % colorsElem.length;
        const newTicketColor = colorsElem[newColorIndex];
        ticketColor.style.background = newTicketColor;

        storageTicketList[currentTicketIndex].ticketColor = newTicketColor;
        updateLocalStorage();
    })
}

let toolBoxColor = document.querySelectorAll('.color');
toolBoxColor.forEach(function(elem) {
    elem.addEventListener('click', function() {
        const selectedColor = elem.classList[0];
        const ticketCont = document.querySelectorAll('.ticket-cont');
        ticketCont.forEach(function(ticket) {
            const ticketCurrentColor = ticket.querySelector('.ticket-color');
            const currentColor = ticketCurrentColor.style.background;
            if(currentColor === selectedColor) ticket.style.display = 'block';
            else ticket.style.display = 'none';
        })
    })
    elem.addEventListener('dblclick', function () {
        const allTickets = document.querySelectorAll('.ticket-cont');
        allTickets.forEach(function (ticket) {
            ticket.style.display = 'block'
        })
    })
})

function initalizeStorage() {
    if(localStorage.getItem('tickets')) {
        for(let i=0;i<storageTicketList.length;i++) {
            createTicket(storageTicketList[i].ticketColor, storageTicketList[i].taskContent, storageTicketList[i].ticketID);
        }
    }
}

initalizeStorage();

function updateLocalStorage() {
    localStorage.setItem('tickets', JSON.stringify(storageTicketList));
}

function getTicketIndex(id) {
    let ticketIdx = storageTicketList.findIndex(function (item) {
        return item.ticketID === id;
    })
    return ticketIdx;
}