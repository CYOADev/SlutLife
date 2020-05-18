#!/usr/bin/env python3
from collections import defaultdict
from enum import IntEnum
import pickle
import json
import re

from column_names import col_names


# TODO: Implement affe
# TODO: Implement ev

options = []
variables = []
conf_excl_all = defaultdict(list)


# Helper functions for getting data

def is_float(string):
    try:
        float(string)
    except ValueError:
        return False
    return True


def is_int(string):
    try:
        int(string)
    except ValueError:
        return False
    return True


class Labels(IntEnum):
    NAME = 0
    CREDITS = 1
    DETAILS = 2
    REQUIRES = 3
    CONFLICT = 4
    AFFECT = 5
    EFFECT = 6
    ROOMMATES = 7
    SALARY = 8
    TIME = 9

    TYPE = 10
    IS_PARENT = 11

    OTHER_REQU = 12
    OTHER_CONF = 13
    OTHER_NUMERIC = 14
    OTHER_EVERY = 15


class Types(IntEnum):
    NOTHING = 0
    SECTION_HEADER = 1
    LABEL = 2
    OPTION = 3


class OptionTypes(IntEnum):
    BO = 0
    NU = 1
    FL = 2
    EV = 3
    EV_EX = 4
    CON = 5
    CON_EX = 6
    TE = 7
    OW = 8
    PU = 9
    CO = 10


class OtherOptionTypes(IntEnum):
    NOTHING = 0
    SET = 1
    SET_VALUE = 2


class Variable():
    def __init__(self, name):
        self.name = name
        self.variable_id = -(len(variables) + 1)
        self.requ = []
        self.conf = []


class Option():
    def __init__(self, row, labels, type_col, is_child):
        self.option_id = len(options)
        self.data = {}
        for i, j in labels:
            row_data = row[j]
            if row_data != '':
                label_data = self.process_label(i, row_data)
                if label_data is not None:
                    self.data[i] = label_data
        self.data[Labels.TYPE] = self.process_type(row[type_col])
        self.data[Labels.IS_PARENT] = 0 if is_child else 1

    LABEL_OPS = {Labels.CREDITS: 'int', Labels.REQUIRES: 'splito',
                 Labels.CONFLICT: 'split', Labels.AFFECT: 'arrow',
                 Labels.EFFECT: 'append', Labels.ROOMMATES: 'int',
                 Labels.SALARY: 'money'}

    def process_label(self, label, data):
        if label in self.LABEL_OPS:
            if self.LABEL_OPS[label] == 'int':
                return self.handle_int(data)
            elif self.LABEL_OPS[label] == 'split':
                return self.handle_split(data)
            elif self.LABEL_OPS[label] == 'splito':
                return self.handle_splito(data)
            elif self.LABEL_OPS[label] == 'arrow':
                return self.handle_arrow(data)
            elif self.LABEL_OPS[label] == 'append':
                return self.handle_append(data)
            elif self.LABEL_OPS[label] == 'money':
                return self.handle_money(data)
            else:
                print(f'Unknown op: {self.LABEL_OPS[label]}')
        else:
            return data.strip()

    def process_type(self, data):
        types = [i.strip() for i in data.split(',')]
        result = [self.process_first_type(types[0])]
        for i in types[1:]:
            res_type = self.process_other_type(i)
            if res_type[0] != 0:
                result.append(res_type)
        return result

    TYPE_MAPS = {
        'BO': OptionTypes.BO,
        'TE': OptionTypes.TE,
        'OW': OptionTypes.OW,
        'PU': OptionTypes.PU,
        'CM': OptionTypes.CO
    }

    def process_first_type(self, data):
        input_type = data[:2]
        if input_type in self.TYPE_MAPS:
            return (self.TYPE_MAPS[input_type],)
        elif input_type == 'NU':
            return self.handle_nu(data)
        elif input_type == 'FL':
            return self.handle_fl(data)
        elif input_type == 'EV':
            return self.handle_ev(data)
        elif input_type == 'CO':
            return self.handle_co(data)
        else:
            print(f'Unknown type: {data}, row: {self.index}')

    def process_other_type(self, data):
        if data[:3] == 'WIP':
            return (OtherOptionTypes.NOTHING,)  # TODO: implement
        elif data[:3] == 'SET':
            name = ' '.join(data.split(' ')[1:-1]).strip()
            val = int(data.split(' ')[-1].strip())
            return (OtherOptionTypes.SET_VALUE, (name, val))
        return (OtherOptionTypes.SET, data.strip())

    def handle_nu(self, data):
        if len(data) > 2:
            nums = data.split()[1:]
            if len(nums) == 1:
                top = int(nums[0]) if is_int(nums[0]) else nums[0]
            return (OptionTypes.NU, top)
        return (OptionTypes.NU)

    def handle_fl(self, data):
        return (OptionTypes.FL,
                float(data.split()[1]),
                float(data.split()[2]))

    def handle_ev(self, data):
        if len(data) < 5 or data[3:5] != 'EX':
            return (OptionTypes.EV, data[2:].strip())
        else:
            return (OptionTypes.EV_EX, data[5:].strip())

    def handle_co(self, data):
        if len(data) < 5 or data[3:5] != 'EX':
            return (OptionTypes.CON,)
        else:
            return (OptionTypes.CON_EX, data[5:].strip())

    def handle_int(self, data):
        return int(data)

    def handle_split(self, data):
        return [i.strip() for i in data.split(',')]

    def handle_splito(self, data):
        data = [i.strip() for i in data.split(',')]
        for ii, i in enumerate(data):
            if len(i.split('/')) != 1:
                data[ii] = [j.strip() for j in i.split('/')]
        return data

    def handle_arrow(self, data):
        res = {}
        for i in re.findall("(.*?)→(.*?)(?:,|$)", data):
            op = i[1].strip()
            for j in i[0].split(','):
                res[j.strip()] = op
        return res

    def handle_append(self, data):
        if Labels.DETAILS in self.data:
            self.data[Labels.DETAILS] = (self.data[Labels.DETAILS] +
                                         '\n' + data.strip())
        else:
            self.data[Labels.DETAILS] = data.strip()
        return ''

    def handle_money(self, data):
        return int(re.sub('[,\\s$]', '', data))


class DataUtil:
    def __init__(self, data):
        self.data = data
        self.get_type_col()
        self.index = 1
        self.labels = []

    def __next__(self):
        # None or string or int
        if self.index >= len(self.data):
            raise StopIteration
        row_type = self.get_type()
        result = None
        if row_type == Types.SECTION_HEADER:
            result = self.data[self.index][0]
        elif row_type == Types.LABEL:
            self.update_label()
        elif row_type == Types.OPTION:
            result = self.construct_option()
        self.index += 1
        return result

    def __iter__(self):
        return self

    def construct_option(self):
        # Constructs and returns an option object
        options.append(Option(self.data[self.index], self.labels,
                              self.type_col, self.is_option(self.index - 1)))
        return len(options) - 1

    def get_type_col(self):
        # Gets the column that contains the type of the row
        for ii, i in enumerate(self.data[0]):
            if i == 'TYPE':
                self.type_col = ii

    def is_option(self, row):
        # Returns True if the type of row is option
        return (len(self.data[row]) > self.type_col and
                self.data[row][self.type_col] not in ['SE', 'LA'])

    def get_type(self):
        # Gets the type of the current row
        if len(self.data[self.index]) <= self.type_col:
            return Types.NOTHING
        type_str = self.data[self.index][self.type_col]
        if type_str == 'SE':
            return Types.SECTION_HEADER
        elif type_str == 'LA':
            return Types.LABEL
        else:
            return Types.OPTION

    LABEL_CONV = {'Name': Labels.NAME, 'Credits': Labels.CREDITS,
                  'Details': Labels.DETAILS, 'Requires': Labels.REQUIRES,
                  'Conflict': Labels.CONFLICT, 'Affect': Labels.AFFECT,
                  'Effect': Labels.EFFECT, 'Roommates': Labels.ROOMMATES,
                  'Salary': Labels.SALARY, 'Time': Labels.TIME}

    def update_label(self):
        # Updates the label list of this class
        self.labels = []
        for ii, i in enumerate(self.data[self.index]):
            if i in self.LABEL_CONV:
                self.labels.append((self.LABEL_CONV[i], ii))
            elif i != '' and ii != self.type_col:
                print(f'Unknown label: {i}, index: {self.index}, '
                      f'row: {self.data[self.index]}')


def find_option_by_name(name):
    for idx, op in enumerate(options):
        if op.data[Labels.NAME] == name:
            return op.option_id
    return name


def add_variable(name):
    for idx, i in enumerate(variables):
        if name == i.name:
            return i.variable_id
    variables.append(Variable(name))
    return variables[-1].variable_id


def opt_add_other_req(cur_id, other_id):
    if Labels.OTHER_REQU not in options[other_id].data:
        options[other_id].data[Labels.OTHER_REQU] = []
    options[other_id].data[Labels.OTHER_REQU].append(cur_id)


def var_add_other_req(cur_id, var_id):
    variables[-(var_id + 1)].requ.append(cur_id)


def opt_add_other_conf(cur_id, other_id):
    if Labels.OTHER_CONF not in options[other_id].data:
        options[other_id].data[Labels.OTHER_CONF] = []
    options[other_id].data[Labels.OTHER_CONF].append(cur_id)


def var_add_other_conf(cur_id, var_id):
    variables[-(var_id + 1)].conf.append(cur_id)


def finalize_requ():
    for ii, i in enumerate(options):
        if Labels.REQUIRES in i.data:
            requ = i.data[Labels.REQUIRES]
        else:
            continue
        for jj, j in enumerate(requ):
            if type(j) is list:
                for kk, k in enumerate(j):
                    option_id = find_option_by_name(k)
                    if type(option_id) is str:
                        option_id = add_variable(option_id)
                        var_add_other_req(ii, option_id)
                    else:
                        opt_add_other_req(ii, option_id)
                    j[kk] = option_id
            else:
                option_id = find_option_by_name(j)
                if type(option_id) is str:
                    option_id = add_variable(option_id)
                    var_add_other_req(ii, option_id)
                else:
                    opt_add_other_req(ii, option_id)
                requ[jj] = option_id


def finalize_conf():
    for ii, i in enumerate(options):
        if Labels.CONFLICT in i.data:
            conf = i.data[Labels.CONFLICT]
        else:
            continue
        for jj, j in enumerate(conf):
            option_id = find_option_by_name(j)
            if type(option_id) is str:
                if option_id[0] == '\u2a52':
                    conf_excl_all[option_id[1:].strip()].append(ii)
                else:
                    option_id = add_variable(option_id)
                    var_add_other_conf(ii, option_id)
            else:
                opt_add_other_conf(ii, option_id)
            conf[jj] = option_id


def finalize_conf_excl():
    for i in conf_excl_all.values():
        for j in range(len(i)):
            for kk, k in enumerate(i):
                if kk != j:
                    opt_add_other_conf(j, k)


def finalize_variables():
    result = []
    for ii, i in enumerate(variables):
        result.append([i.name, i.requ, i.conf])
    return result


def finalize_options():
    finalize_requ()
    finalize_conf()
    result = []
    for ii, i in enumerate(options):
        result.append(i.data)
    return result


# Function for different sheets
# Result: [[type, {name: str, cred: int, desc: str, requ: [str, str...],
#                  conf: [str, str...], parent: bool}]]
# Type: 0 - option, 1 - section header

def process_column(data, col_name):
    data_util = DataUtil(data[col_name])
    result = []
    for i in data_util:
        if i is not None:
            result.append(i)
    return result


# Main method

def main():
    sheet_data = None
    with open('resources/sheet_data.pickle', 'rb') as f:
        sheet_data = pickle.load(f)
    result = []
    for i in col_names:
        result.append(process_column(sheet_data, i))
    result = {
        'layout_data': result,
        'option_data': finalize_options(),
        'variables': finalize_variables(),
        'col_names': col_names
    }
    with open('../src/assets/sheet_data.json', 'w') as f:
        # json.dump(result, f, indent=4)
        json.dump(result, f)


if __name__ == '__main__':
    main()