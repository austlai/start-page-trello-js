var list_index = parseInt(sessionStorage.getItem('list_index'), 10);
if (!list_index) {
    var list_index = 0;
}
show_list(list_index);


function on_click(index) {
    show_list(list_index += index);
    sessionStorage.setItem('list_index', list_index);
}

function show_list(index) {
    var lists = document.getElementsByClassName("list_container");
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

const node = document.getElementsByClassName("card_add");
node.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        document.add_card.submit();
    }
});