class Hare:
    def __init__(self, name):
        self.name = name
        self.eat = 0

    def eat_carrot(self, eda):
        self.eat += eda
        return self.eat

    def jump(self):
        if self.eat < 10:
            self.eat -= 10
            return f'{self.name} прыгнул на {self.eat % 10} м.'
        else:
            return f'{self.name} устал, надо поесть.'
hare = Hare('Крош')
print(hare.jump())
print(hare.eat_carrot(15))
print(hare.jump())
print(hare.jump())