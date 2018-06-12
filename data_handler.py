import data_manager


def get_board_ids_out(board_ids):
    result = []
    for i in range(len(board_ids)):
        result.append(board_ids[i]["board_id"])
    return result
