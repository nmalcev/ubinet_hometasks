# Copyright (C) Nikolai MALTSEV 2018
# Exercise 6. Shortest Path with Sage
# For execution sage script use https://sagecell.sagemath.org/
# Original task http://www-sop.inria.fr/members/Frederic.Giroire/teaching/ubinet/pdfs/exercises-solvers.pdf

edges = {
	0: {1: 4, 2:1},
	1: {2: 2, 4: 3},
	2: {3: 2},
	3: {1: 1, 4: 1, 5: 3},
	4: {2: 2, 5: 2},
	5: {}
}
g = DiGraph(edges, weighted=True)
s = 0 # start point
p = 5 # end point

def shortestPath(g, start, end):
	# Find shortest path in weighted graph
	p = MixedIntegerLinearProgram(maximization=False)
	b = p.new_variable(binary=True)
	p.set_objective(sum([w * b[(u, v)] for (u, v, w) in g.edges()]))

	for u in g:
		if u != start and u != end:
			p.add_constraint(
				sum([b[(v, u)] for v in g.neighbors_in(u)]) == sum([b[(u, v)] for v in g.neighbors_out(u)])
			)
		else:
			p.add_constraint(
				sum([b[(v, u)] for v in g.neighbors_in(u)]) - sum([b[(u, v)] for v in g.neighbors_out(u)]) == (-1 if u == start else 1)
			)

	p.solve()
	b = p.get_values(b)
	m = [(u, v) for (u, v, w) in g.edges() if b[(u, v)] == 1]
	return m


m = shortestPath(g, s, p)
print "Edges: ", m

g.show(edge_labels=True, edge_colors={"red": m})

# Result:  [(0, 2), (2, 3), (3, 5)]