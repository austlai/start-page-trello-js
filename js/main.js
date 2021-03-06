window.onload = function() {
    this.initSearchBar()
    this.updateTimeHook()
    this.main()
}

// functions controlling main content
function initSearchBar() {
    document.getElementById("search-bar-input").value = ""
    document.getElementById("search-bar-input").focus()
    searchUrl = "https://www.google.com/search?q="
    document.getElementById("search-bar-input").placeholder = `Search something`
    document.getElementById("search-bar-input").addEventListener("keypress", (event) => {
        if (event.key != 'Enter') return
        query = document.getElementById("search-bar-input").value
        query = query.replace(/\ /g, "+")
        document.location = searchUrl + query
    })
}

function updateTime() {
    currentDate = new Date()
    options = {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: undefined
            }
    finalDate = currentDate.toLocaleString(undefined, options)
    document.getElementById("date-text").textContent = finalDate
}

function updateTimeHook() {
    updateTime()
    interval = setInterval(() => {
        updateTime()
    }, 30 * 1000)
}

//functions controlling trello data get

var API_KEY = 'ad16b3881276bec6ac47d39a77c62342';

var authenticationSuccess = function() {
    console.log('Successful authentication');
};
  
var authenticationFailure = function() {
    console.log('Failed authentication');
};

Trello.setKey(API_KEY);

if (!localStorage.trello_token) {
    window.Trello.authorize({
        type: 'redirect',
        name: 'start-page',
        scope: {
        read: 'true',
        write: 'true' },
        expiration: 'never',
        interactive: true,
        persist: false,
        success: authenticationSuccess,
        error: authenticationFailure
    });
}
Trello.setToken(localStorage.getItem('trello_token'));

function get_boards() {return Trello.get(`/members/me/boards`);}

async function get_board_member_id() {
    var board_all = await get_boards();
    var board_select = board_all[0]; // SELECTING FIRST BOARD
    board_id = board_select.id;
    member_id = board_select.idMemberCreator;
    return [board_id, member_id];
}

function get_lists(board_id) {return Trello.get(`/boards/${board_id}/lists`)}

function get_cards(board_id) {return Trello.get(`/boards/${board_id}/cards/visible`)}

async function trello_data() {
    var board_member = await get_board_member_id();
    var board_id = board_member[0];
    var list_all = await get_lists(board_id);
    var cards = await get_cards(board_id);
    prev_idlist = cards[0].idList;
    var new_list = [];
    var card_array = [];
    cards.forEach(card => {
        if (card.idList != prev_idlist) {
            prev_idlist = card.idList;
            card_array.push(new_list);
            new_list = [];
            new_list.push(card.name);
        } else {
            new_list.push(card.name);
        }
    })
    card_array.push(new_list);
    var list_names = []
    list_all.forEach(list => {
        list_names.push(list.name)
    })
    return [card_array, list_names];    
}

async function card_add(list_title, card_string) {
    var board_member = await get_board_member_id();
    var board_id = board_member[0]; 
    var list_all = await get_lists(board_id);
    var list_id;
    list_all.forEach(list => {
        if (list.name == list_title) {
            list_id = list.id;
        }
    })
    var new_card = {
        name: card_string,
        idList: list_id,
        pos: 'bottom'
    };
    await window.Trello.post('/cards/', new_card);
    location.reload();
}

function card_remove(card_name) {
    return async function() {
        var result = confirm('Are you sure?')
        if (result) {
            var board_member = await get_board_member_id();
            var board_id = board_member[0]; 
            var cards = await get_cards(board_id);
            var card_id;
            cards.forEach(card => {
                if (card.name == card_name) {
                    card_id = card.id;
                }
            })
            await window.Trello.put(`/cards/${card_id}`, {closed: true});
            location.reload()
        }
    }
}

// Functions to build page

async function main() {
    var card_list = await trello_data(); //getrello
    var list_names = card_list[1];
    var card_names = card_list[0];
    var body_tag = document.getElementById('html');
    var insert = document.getElementById('insert');
    for (var list_name of list_names) {
        var list_container = document.createElement('div');
        list_container.className = 'list_container';
        insert.appendChild(list_container);
        var list_header = document.createElement('div');
        list_header.className = 'list_header';
        list_header.innerHTML = list_name;
        list_container.append(list_header)
        var list_content = document.createElement('div');
        list_content.className = 'list_content';
        list_container.append(list_content)
        for (var card_name of card_names[list_names.indexOf(list_name)]) {
            var card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = card_name;
            list_content.append(card);
            var button = document.createElement('button');
            button.className = "card_delete fas fa-times"
            button.type = "submit"
            button.addEventListener('click', card_remove(card_name));
            card.append(button);
        }
        var add_input = document.createElement('input')
        add_input.className = "card_add"
        add_input.type = "text"
        add_input.placeholder = "new"
        add_input.autocomplete = "off"
        add_input.addEventListener("keypress", function(event) {
            if (event.key === "Enter" && this.value != "") {
                card_add(this.parentElement.previousSibling.innerHTML, this.value);
            }
        }); 
        list_content.appendChild(add_input)
    }
    var insert_js = document.createElement('script');
    insert_js.src = 'js/list_cycle.js';
    body_tag.append(insert_js);
}
document.addEventListener("DOMContentLoaded", function() { 
    document.getElementById("prev").addEventListener('click', function() {on_click(-1);});
    document.getElementById("next").addEventListener('click', function() {on_click(1);});
    document.getElementById("prev_small").addEventListener('click', function() {on_click(-1);});
    document.getElementById("next_small").addEventListener('click', function() {on_click(1);});
});
