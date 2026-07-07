"""
仮想プロジェクト: 簡素な TODO サーバ。
S6 では「このプロジェクトに対してミニ運用キットを組む」演習に使う。
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable


@dataclass
class Todo:
    id: int
    title: str
    done: bool = False


@dataclass
class TodoStore:
    items: list[Todo] = field(default_factory=list)
    _next_id: int = 1

    def add(self, title: str) -> Todo:
        todo = Todo(id=self._next_id, title=title)
        self._next_id += 1
        self.items.append(todo)
        return todo

    def complete(self, todo_id: int) -> None:
        for t in self.items:
            if t.id == todo_id:
                t.done = True
                return
        raise KeyError(todo_id)

    def open_items(self) -> Iterable[Todo]:
        return (t for t in self.items if not t.done)
