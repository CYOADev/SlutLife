#!/usr/bin/env python3
from os import path
import pygsheets
import pickle
import sys


from column_names import col_names


names = [
    'Helpers',
    'Difficulty',
    'Origins',
    'Body Modification',
    'Housing',
    'Clothing',
    'Health and Hygiene',
    'Food',
    'Roommates',
    'Neighbors',
    'Entertainment',
    'Experimental Drugs',
    'Jobs',
    'Owners',
    'Rating Boosters',
    'Time Adjustments',
    'Miscellaneous Adjustments',
    'End of Show Options',
    'Rewards',
    'Punishments',
    'Possible Controllers',
    'Vehicles',
    'World Notes',
]


def main():
    global col_names

    sheet_data = {}
    try:
        if path.exists('resources/sheet_data.pickle'):
            with open('resources/sheet_data.pickle', 'rb') as f:
                sheet_data = pickle.load(f)
    except Exception:
        pass

    gc = pygsheets.authorize(client_secret="resources/client_secret.json",
                             credentials_directory="resources/")
    sheet = gc.open("Modified SL CYOA")

    if len(sys.argv) > 1:
        col_names = [sys.argv[1]]
        del sheet_data['TIMESTAMP']

    if 'TIMESTAMP' in sheet_data and sheet_data['TIMESTAMP'] == sheet.updated:
        print('Up to date')
        return

    sheet_data['TIMESTAMP'] = sheet.updated
    for i in col_names:
        worksheet = sheet.worksheet_by_title(i)
        print(f'Updating sheet {i}...')
        cells = worksheet.get_all_values(include_tailing_empty_rows=False,
                                         include_tailing_empty=False,
                                         returnas='matrix')
        sheet_data[i] = cells

    with open('resources/sheet_data.pickle', 'wb') as f:
        pickle.dump(sheet_data, f)


if __name__ == '__main__':
    main()
