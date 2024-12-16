import m from 'mithril';
import Viva from 'vivagraphjs';

const appDataUrl = 'appData.json';

let appState = {
	names: [],
	table: [],

	selectedFirst: new Set(),
	selectedSecond: new Set(),

	disabledFirst: new Set(),
	disabledSecond: new Set(),

	solutions: [],
};

// Fetch app data from JSON
m.request(appDataUrl).then(data => {
	appState.names = data.names;
	appState.table = data.table;
	m.redraw();
});

function resetCheckboxList() {
	appState.selectedFirst.clear();
	appState.selectedSecond.clear();

	appState.disabledFirst.clear();
	appState.disabledSecond.clear();

	appState.solutions = [];
};

window.addEventListener('load', function() {
	m.mount(document.body, {
		view: function(vnode) {
			return [
			m("#zone1", [
				m('.lists', [

					m('#first.list', [
						m('.listHeader', [
							m('span.caption', 'Что нужно улучшить?'),
							m('button.button', {
								onclick: function(event) {
									resetCheckboxList();
								}
							}, 'Сбросить')
						]),
						m('.listWrapper', [
							appState.names.map(function (value, index) {
								return m('.listItem', { key: 'si_' + index }, [
									m('label.name', {
										disabled: appState.disabledFirst.has(index)
									}, [
										m('input', { 
											type:'checkbox', 
											checked: (appState.selectedFirst.has(index)), 
											disabled: (appState.disabledFirst.has(index)),
											value: index, 
											onclick: () => {
												toggleSelection(index, true);
											}
										}),
										value
									]),
								])
							})
						])
					]),

					m('#second.list', [
						m('.listHeader', [
							m('span.caption', 'Что ухудшается?'),
							m('button.button', {
								onclick: function(event) {
									resetCheckboxList();
								}
							}, 'Сбросить')
						]),
						m('.listWrapper', [
							appState.names.map(function (value, index) {
								return m('.listItem', { key: 'sd_' + index }, [
									m('label.name', {
										disabled: (appState.disabledSecond.has(index))
									}, [
										m('input', { 
											type:'checkbox', 
											checked: (appState.selectedSecond.has(index)), 
											disabled: (appState.disabledSecond.has(index)),
											value: index, 
											onclick: () => {
												toggleSelection(index, false);
											}
										}),
										value
									]),
								])
							})
						])
					])

				]),

				m('.lists', [
					m('div#foundedSolutions.list.wide', [
						
						m('.listHeader', [
							m('span.caption', 'Возможные решения'),
						]),
						m('.listWrapper', [
							appState.solutions.map(function (value, index) {
								return m('.listItem.solutions', { key: 'sol_' + index }, [

									value.solutions.length > 0 ? [
										Object.values(value.rules).map((rule, index) => {
											return m('span.badge-solution', appState.names[rule]);
										}),
										Object.values(value.solutions).map((solution, index) => {
											return m('span.badge-solution', [
												solution
											]);
										})
									] : null
								]);
							})
						])
					]),
				])

			]),
			m('#graph', [])
			]
		}
	})
});

function toggleSelection(index, isFirst) {
	let selected = isFirst ? appState.selectedFirst : appState.selectedSecond;

	if (selected.has(index)) {
		selected.delete(index);
	} else {
		selected.add(index);
	}

	appState.disabledFirst.clear();
	appState.disabledSecond.clear();
	appState.solutions = [];

	appState.selectedFirst.forEach((v, x) => {
		appState.names.forEach((v2, y) => {
			let tableItem = appState.table[x][y];
			if (typeof(tableItem) !== 'object' && (tableItem === '-' || tableItem === '*')) {
				appState.disabledSecond.add(y);
			}
		});
	});

	appState.selectedSecond.forEach((v, x) => {
		appState.names.forEach((v2, y) => {
			let tableItem = appState.table[x][y];
			if (typeof(tableItem) !== 'object' && (tableItem === '-' || tableItem === '*')) {
				appState.disabledFirst.add(y);
			}
		});
	});

	appState.selectedFirst.forEach((v, x) => {
		appState.selectedSecond.forEach((v2, y) => {
			let tableItem = appState.table[x][y];
			if (typeof(tableItem) === 'object') {
				appState.solutions.push({
					rules: [x, y],
					solutions: tableItem
				});
			}
		});
	});

	let nodes = [];
	let links = [];
	var graph = Viva.Graph.graph();

	appState.solutions.map(function (value, index) {
		if (value.solutions.length > 0) {
			let idx = index+1;

			let names = [];
			Object.values(value.rules).map((rule, index2) => {
				names.push(appState.names[rule]);
			});
			nodes.push({
				name: names.join(' '),
				id: idx,
				type: 'contradiction'
			});

			// let values = [];
			Object.values(value.solutions).map((solution, index2) => {
				let idx2 = index2+1;
				nodes.push({
					name: solution,
					id: idx2*idx+100,
					type: 'solution'
				});

				links.push({
					source: idx,
					target: idx2*idx+100
				});
			});
		}
	});
	
	nodes.forEach(element => {
		graph.addNode(element.id, element);
	});

	links.forEach(element => {
		graph.addLink(element.source, element.target);
	});
	
	var graphics = Viva.Graph.View.svgGraphics();
	
	graphics.node(function(node) {
		return (node.data.type === 'contradiction') ? 
		Viva.Graph.svg('rect')
			.attr('width', 24)
			.attr('height', 24)
			.attr('fill', '#f5f5f5')
			.attr('stroke', '#aaf')
			.attr('stroke-width', '2px')
			.attr('rx', '12')
		:

		Viva.Graph.svg('rect')
			.attr('width', 24)
			.attr('height', 24)
			.attr('fill', '#fafafa')
			.attr('stroke', '#faa')
			.attr('stroke-width', '2px')
			.attr('rx', '12')
	})
	.placeNode(function(nodeUI, pos){
		// Shift image to let links go to the center:
		nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12);
	});
	
	document.getElementById('graph').innerHTML = '';
	var renderer = Viva.Graph.View.renderer(graph, {
		container: document.getElementById('graph'),
		graphics : graphics
  	});
  	renderer.run();
}

if (window.DEV_MODE) {
	new EventSource('/esbuild').addEventListener('change', () => location.reload())
}