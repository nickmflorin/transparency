class A:
	def __init__(self):
		self.a = 1

a = A()
test1 = getattr(a, 'a')
test2 = getattr(a, 'b')

print test1 
print test2