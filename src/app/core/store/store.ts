import * as ACTION from './actions';
import { IFlowchart } from '@models/flowchart';
import { execute_flowchart } from '../execute';
import { PortType, InputType, OutputType } from '@models/port'; 

export interface IAppState{
    name: string;
    author: string; 
    flowchart: IFlowchart;
    last_updated: Date;
    version: number;
}

export const INITIAL_STATE: IAppState = {
    name: "default_file.mob",
    author: "new_user", 
    flowchart: <IFlowchart>{ 
                    nodes: [
                        {   
                            id: 'asdads',
                            name: "first_node", 
                            position: {x: 0, y: 0}, 
                            procedure: [],
                            inputs: [
                                {
                                    name: 'a--input', 
                                    default: 0,
                                    value: 0,
                                    isConnected: false,
                                    meta: {
                                        mode: InputType.Slider, 
                                        opts: { min: 0, max: 12, increment: 1}
                                    }
                                }
                            ],
                            outputs: [
                                {
                                    name: 'a-output', 
                                    isConnected: false,
                                    meta: {
                                        mode: OutputType.Text, 
                                    }
                                }
                            ]
                        }, 
                        {
                            id: 'sadsdad',
                            name: "second_node", 
                            position: {x: 0, y: 0},
                            procedure: [],
                            outputs: [
                                { name: 'result' }
                            ]
                        }, 
                    ]
                },
    last_updated: new Date(),
    version: 1
}

export function rootReducer(state, action){

    switch (action.type) {

        case ACTION.ADD_NODE:
            return Object.assign({}, state);
            // return Object.assign({}, state, FlowchartUtils.add_node(state.flowchart));
        
        case ACTION.NEW_FLOWCHART:
            state.flowchart = <IFlowchart>{}
            return Object.assign({}, state, state);
        
        case ACTION.LOAD_FLOWCHART:
            state.flowchart = action.flowchart.flowchart;
            return Object.assign({}, state, state);
        
        case ACTION.EXECUTE:
            //state.flowchart = execute_flowchart(state.flowchart);
            alert("Executing!");
            return Object.assign({}, state, state); ;
    }

    return state;
}


