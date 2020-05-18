class OptionData:
    def __init__(self):
        self.data["variables"] = {}
        self.exclusives = {}

    def init_option(self, option, name):
        self.data[name]["adds_var"] = [i[1] for i in option["type"][1:]
                                       if i[0] == 1]
        self.data[name]["sets_var"] = [[i[1][0], i[1][1]] for i in
                                       option["type"][1:] if i[0] == 2]
        self.data[name]["other_requ"] = []
        self.data[name]["other_conf"] = []
        self.data[name]["affe"] = []
        self.data[name]["other_ev"] = []

    def init_variable(self, name):
        self.data["variables"][name] = {}
        self.data["variables"][name]["other_requ"] = []
        self.data["variables"][name]["other_conf"] = []
        self.data["variables"][name]["other_nu"] = []
        self.data["variables"][name]["other_ev"] = []

    def add_variables(self, option, name):
        names = (self.data[name]["adds_var"] +
                 list(map(lambda i: i[0], self.data[name]["sets_var"])))
        for name in names:
            if name not in self.data["variables"]:
                self.init_variable(name)

    def add_excludes(self, option, name):
        for i in self.data[name]["conf"]:
            excl_name = i[1:].strip()
            if excl_name in self.exclusives:
                self.exclusives[excl_name].append(name)
            else:
                self.exclusives[excl_name] = [name]

    def add_num_variables(self, option, name):
        op_type = option["type"][0]
        if op_type[0] == 1 and type(op_type[1]) is str:
            if op_type[1] not in self.data["variables"]:
                print(f"Name not recognized: {op_type[1]}")
            var = self.data["variables"][op_type[1]]
            var["other_nu"].append((0, name))
        if op_type[0] == 1 and type(op_type[2]) is str:
            if op_type[2] not in self.data["variables"]:
                print(f"Name not recognized: {op_type[1]}")
            var = self.data["variables"][op_type[2]]
            var["other_nu"].append((1, name))

    def add_affects(self, option, name):
        if "affe" in option:
            for i, j in option["affe"].items():
                op = {"+": 0, "-": 1, "×": 2, "÷": 3}
                op = op[j[0]] if j[0] in op else 4
                if op == 4:
                    j = int(j)
                else:
                    j = int(j[1:])
                self.data[name]["affe"].append((i, op, j))

    def add(self, option):
        name = option["name"]
        if option["type"][0][0] == 10:
            return
        if name in self.data:
            print(f"Duplicate name: {name} with id: "
                  f"{self.data['option_id'][name]} and "
                  f"{len(self.data['option_name'])}")
        self.init_option(option, name)
        self.add_variables(option, name)
        self.add_excludes(option, name)
        self.add_num_variables(option, name)
        self.add_affects(option, name)

    def validate_exist(self, option):
        if option not in self.data and option not in self.data["variables"]:
            print(f"{option} does not exist")

    def finalize_requ(self, name):
        requ = self.data[name]["requ"]
        for ii, i in enumerate(requ):
            if type(i) is list:
                for j in i:
                    self.validate_exist(j)
                    if j in self.data:
                        self.data[j]["other_requ"].append(name)
                    else:
                        print("Cannot have variable in or condition yet")
            else:
                self.validate_exist(i)
                if i in self.data:
                    self.data[i]["other_requ"].append(name)
                else:
                    self.data["variables"][i]["other_requ"].append(name)

    def finalize_conf(self, name):
        conf = self.data[name]["conf"]
        excl_names = []
        for ii, i in enumerate(conf):
            if i[0] not in "⩒":
                if type(i) is list:
                    print(f"{i} in conf is a list")
                else:
                    self.validate_exist(i)
            else:
                excl_names.append((ii, self.exclusives[i[1:].strip()]))
        for ii, i in reversed(excl_names):
            conf += [j for j in i if j != name]
            del conf[ii]
        for ii, i in enumerate(conf):
            if i in self.data:
                self.data[i]["other_conf"].append(name)
            else:
                self.data["variables"][i]["other_conf"].append(name)
        self.data[name]["conf"] = conf

    def finalize_affe(self, name):
        # Affect precedence: [set, /, *, -, +]
        affe = self.data[name]["affe"]
        for i in affe:
            # name: 0, op: 1, affe: 2
            if i[0] not in self.data["option_id"]:
                print(f'Affect name {i[0]} does not exist')

    def finalize_ev(self, name):
        option_type = self.data["option_type_full"][name]
        if option_type[0] != 3 and option_type[0] != 4:
            return
        op_name = option_type[1]
        op_type = option_type[0]
        if option_type[1] not in self.data["option_id"]:
            self.data["variables"][op_name]["other_ev"].append((op_type, name))
        else:
            self.data[op_name]["other_ev"].append((op_type, name))

    def finalize(self):
        for name in self.data["option_name"]:
            self.finalize_requ(name)
            self.finalize_conf(name)
            self.finalize_affe(name)
            self.finalize_ev(name)
        return self.data
