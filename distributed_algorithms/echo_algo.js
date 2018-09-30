// Copyright (C) Maltsev Nikolai 2018
// Implementation of Echo algorithm: count the number of processes
// The process starts from initiator node and terminate on it


class Node {
	constructor(id_s) {
		this.id_s = id_s;
		this.counter_n = 1; // Count self 
		// By that flag we transform cycle-directional graph at tree-directional graph
		// It helps to reduce number of sending messages between processes
		this.haveParticipated_b = false; // Also that flag helps to prevent double counting
		this.askedNodes_n = 0; // Count of participated nodes
		this.neighbors_c = [];
	}
	// Initialize relationships
	init (childs_Node$c) {
		this.neighbors_c = childs_Node$c;
	}
	// Method for sending message from parent to child
	sendInfo (parent_Node) {
		// Process that have sent Info message will receive Echo message in future
		this.parent_Node = parent_Node; 
		this.haveParticipated_b = true;
		
		// Get list of nodes which will recieve Info message
		// We skip recently polled nodes
		let sendList_Node$c = this.neighbors_c.
			filter(n_Node => n_Node.haveParticipated_b != true); 

		let i = sendList_Node$c.length;
		this.askedNodes_n = sendList_Node$c.length;
		
		// Ask all neighbors
		while (i-- > 0){
			sendList_Node$c[i].sendInfo(this);
		}
		
		// Check if it last participated node
		if (sendList_Node$c.length == 0 && this.parent_Node) {
			this.parent_Node.recieveEcho(this.counter_n, this);
		}

		return this;
	}
	// Method for sending message from child to parent
	recieveEcho(counter_n){
		this.counter_n += counter_n;
		this.askedNodes_n--;
		
		// Check if we have recieved from all not asked neighbors
		if (this.askedNodes_n == 0) {		
			if (this.parent_Node) {
				this.parent_Node.recieveEcho(this.counter_n, this);
			} else { // if it is initiator Node
				console.log('Total number of processes %s', this.counter_n);
			}	
		}
	}
}

// Definition of vertices of graph
const ROOT_NODE = new Node('root');
const a_Node = new Node('a');
const b_Node = new Node('b');
const c_Node = new Node('c');
const d_Node = new Node('d');
const e_Node = new Node('e');
const f_Node = new Node('f');

// Definition of edges of graph
ROOT_NODE.init([a_Node, c_Node]);
a_Node.init([b_Node]);
c_Node.init([b_Node, d_Node]);
b_Node.init([d_Node]);
d_Node.init([e_Node, f_Node, ROOT_NODE]);

// Execute message process
ROOT_NODE.sendInfo(null);
