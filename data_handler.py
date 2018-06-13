import data_manager


def get_board_ids_out(board_ids):
    result = []
    for i in range(len(board_ids)):
        result.append(board_ids[i]["board_id"])
    return tuple(result)


def get_statuses():
    statuses =  {"statuses":[{"id":1,"name":"New"},
                            {"id":2,"name":"In progress"},
                            {"id":3,"name":"Testing"},
                            {"id":4,"name":"Done"}]}
    return statuses
