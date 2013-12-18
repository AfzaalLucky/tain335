import sublime
from sublime_plugin import TextCommand

class LoopyCommand(TextCommand):
	def run(self, edit):
		sels = self.view.sel()
		for sel in sels:
			self.view.insert(edit, 0, self.view.substr(sel))

