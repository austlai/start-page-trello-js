from trello import TrelloClient, Board, List, Card
import os
import requests
import requests_oauthlib
import dateutil as date
import pytz

client = TrelloClient(
    api_key = os.getenv('TRELLO_API_KEY'),
    api_secret = os.getenv('TRELLO_API_SECRET'),
    token = '53d6411299f95d817cc9650554df46a44248fb469f4945e1d5d732a13fd9361c',
)

board = Board(
    client = client,
    board_id = client.list_boards()[1].id
)

def trello_data():
    list_list = board.open_lists()
    list_names = []
    card_list = []
    for list in list_list:
        open_list = List(board = board, list_id = list.id)
        list_names.append(list.name)
        open_cards = open_list.list_cards()
        sub_list = []
        for card in open_cards:
            sub_list.append(card.name)
        card_list.append(sub_list)

    trello_dict = dict(zip(list_names, card_list))
    return trello_dict

def card_remove(card_name):
    total_lists = board.open_lists()
    for select_list in total_lists:
        open_list = List(board = board, list_id = select_list.id)
        open_cards = open_list.list_cards()
        for card in open_cards:
            if card.name == card_name:
                remove = Card(parent = open_list, card_id=card.id)
                remove.set_closed(True)
                break

def card_add(list_title, card_string):
    total_lists = board.open_lists()
    for select_list in total_lists:
        if select_list.name == list_title:
            open_list = List(board = board, list_id = select_list.id)
            break
    open_list.add_card(name = card_string, position='bottom')
