// Copyright (C) Maltsev Nikolai 2018
// Implementation of tel election leader algorithm

class Process {
	constructor (id_s, weight_n) {
		this.weight_n = weight_n;
		this.id_s = id_s;
	}

	// All relationships are bi-directional
	init (neighbors_Process$c) {
		this.neighbors_Process$c = neighbors_Process$c;
	}

	// Topology of network is build without any hierarchy so message can be send multiple times between each neighbors
	// Each node send message to all their neighbors until all of them doesn't have reference on a leader
	sendUpdateLeaderMessage (_currentLeader_Process, sender_Process) {
		// Detect current leader
		this.currentLeader_Process = this.weight_n >= _currentLeader_Process.weight_n ?
			this :
			_currentLeader_Process;
		
		console.log('Send (%s -> %s) curLeader: %s', sender_Process.id_s, this.id_s, this.currentLeader_Process.id_s)

		let neighborsList_Process$c = this.neighbors_Process$c
			.filter(p_Process => p_Process.currentLeader_Process != this.currentLeader_Process);

		neighborsList_Process$c.forEach(p_Process => {
			p_Process.sendUpdateLeaderMessage(this.currentLeader_Process, this);
		});
	}
}

// Definition of vertices of graph
let aProcess = new Process('a', 1);
let bProcess = new Process('b', 2);
let cProcess = new Process('c', 3);
let dProcess = new Process('d', 4);
let eProcess = new Process('e', 5);
// let gProcess = new Process('g', 0);
let fProcess = new Process('f', 6); // F will be a lider

// Definition of edges of graph
aProcess.init([bProcess, cProcess]);
bProcess.init([aProcess, cProcess, dProcess]);
cProcess.init([aProcess, bProcess, dProcess/*, gProcess*/]);
dProcess.init([cProcess, bProcess, eProcess, fProcess]);
eProcess.init([dProcess]);
fProcess.init([dProcess]);
// gProcess.init([cProcess]);
// If B node is leader
bProcess.sendUpdateLeaderMessage(bProcess, bProcess);
// If F node is initiator
// fProcess.sendUpdateLeaderMessage(fProcess, fProcess);