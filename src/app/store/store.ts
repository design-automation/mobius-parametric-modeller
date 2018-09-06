import { ADD_NODE, REMOVE_NODE, SELECT_NODE } from './actions';

/// import test data
/// remove in production
import * as test_data from './mocks/simple-test-1.mob';

export interface IAppState{
    mbJSON: any;
	nodes: any[];
    selected_node: any;
	lastAction: string;
	lastUpdate: Date;
}

export function rootReducer(state, action){
    switch (action.type) {
        case ADD_NODE:
            return Object.assign({}, state, {
                nodes: state.nodes.concat(Object.assign({}, {name: "newnode"} )),
                lastUpdate: new Date()
            })
        
        case REMOVE_NODE:
            return Object.assign({}, state, {
                nodes: state.nodes.filter(t => t.id !== action.id),
                lastUpdate: new Date()
            })

        case SELECT_NODE:
            console.log("action", action, "state", state)
            return Object.assign({}, state, {
                nodes: state.nodes,
                selected_node: action.action,
                lastAction: SELECT_NODE,
                lastUpdate: new Date()
            })
    }
    return state;
}

export const INITIAL_STATE: IAppState = {
    mbJSON: null,
	nodes: [],
    selected_node: null,
	lastAction: null,
    lastUpdate: new Date()
}


