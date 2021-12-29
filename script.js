const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));

  listArrays = [backlogListArray,progressListArray,completeListArray,onHoldListArray];

  const arrayNames = ['backlog','progress','complete','onHold']

  arrayNames.forEach( (item,index) => {
    localStorage.setItem( `${item}Items`, JSON.stringify(listArrays[index]) );
  })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.id=index;
  listEl.classList.add('drag-item');
  
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${column},${index})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  
 
  
  columnEl.appendChild(listEl);
}

function updateItem(column,id){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  //console.log(selectedArray, selectedColumnEl);

  if(!dragging){
    if(selectedColumnEl[id].textContent === ''){
      selectedArray.splice(id,1);
      //updateDOM();
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
      //updateDOM();
    }
    updateDOM();
  }
  
}
// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once

  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column

  backlogList.textContent = '';
  backlogListArray.forEach( (item, index) => {
    createItemEl(backlogList, 0, item, index)
  })
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach( (item, index) => {
    createItemEl(progressList, 1, item, index)
  })
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach( (item, index) => {
    createItemEl(completeList, 2, item, index)
  })
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach( (item, index) => {
    createItemEl(onHoldList, 3, item, index)
  })
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();

}

function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
  //addItemContainers[column].classList.remove('show-input');
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}
//Allow array to save in localStorage
function rebuildArrays() {
  
  
  
  
  // listColumns.forEach( (column, index) => {
  //   const columnItems = column.querySelectorAll('.drag-item');
  //   columnItems.forEach( (item) => {
  //     listArrays[index].push(item.textContent);
  //   })
  // })
  console.log(backlogList.children);
  // console.log(progressList.children);
  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);

  updateDOM();
}
//When item starts dragging

function drag(event) {
  draggedItem = event.target;
  dragging = true;
  //console.log('draggedItem:', draggedItem);
}

function allowDrop(event) {
  event.preventDefault();
}

//dropping item in column
function drop(event) {
  event.preventDefault();
  listColumns.forEach( (column) => {
    column.classList.remove('over');
  })

  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

function dragEnter(column){
  //console.log(listColumns[column]);
  listColumns[column].classList.add('over');
  currentColumn = column;
}
updateDOM();