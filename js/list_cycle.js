// list_cycle functions

var list_index = parseInt(sessionStorage.getItem('list_index'), 10);
if (!list_index) {
    var list_index = 0;
}
show_list(list_index);
 

function on_click(index) {
    show_list(list_index += index);
    sessionStorage.setItem('list_index', list_index);
}

function get_list_element() {
    return document.getElementsByClassName("list_container");
}

function show_list(index) {
    var lists = get_list_element();
    if (index >= lists.length) {
        list_index = 0;
    }
    if (index < 0) {
        list_index = lists.length - 1;
    }
    for (var i = 0; i < lists.length; i++) {
        lists[i].style.display = "none";
    }
    lists[list_index].style.display = "inline-block"
}