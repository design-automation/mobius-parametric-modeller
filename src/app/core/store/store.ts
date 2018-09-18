import * as ACTION from './actions';
import { IFlowchart } from '@models/flowchart';

import { ProcedureTypes } from '@models/procedure';

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
    flowchart: <IFlowchart>{ nodes: [
            {   
                id: 'asdads',
                name: "first_node", 
                position: {x: 0, y: 0}, 
                procedure: [
                    {
                        type: ProcedureTypes.VARIABLE,
                        args: [ {
                                    name: 'new_variable', 
                                    value: 'x'
                                  },
                                  {
                                    name: 'value', 
                                    value: 10
                                  }
                                ],
                        parent: undefined,
                        children: []
                    },
                    {
                        type: ProcedureTypes.FOREACH,
                        args: [ {
                                    name: 'element', 
                                    value: 'x'
                                  },
                                  {
                                    name: 'array', 
                                    value: undefined
                                  }
                                ],
                        parent: undefined,
                        children: [
                            {
                                type: ProcedureTypes.VARIABLE,
                                args: [ {
                                            name: 'new_variable', 
                                            value: 'x'
                                          },
                                          {
                                            name: 'value', 
                                            value: 10
                                          }
                                        ],
                                parent: undefined,
                                children: []
                            },
                            {
                                type: ProcedureTypes.FOREACH,
                                args: [ {
                                            name: 'new_variable', 
                                            value: 'x'
                                          },
                                          {
                                            name: 'value', 
                                            value: 10
                                          }
                                        ],
                                parent: undefined,
                                children: [
                                    {
                                        type: ProcedureTypes.VARIABLE,
                                        args: [ {
                                                    name: 'new_variable', 
                                                    value: 'x'
                                                  },
                                                  {
                                                    name: 'value', 
                                                    value: 10
                                                  }
                                                ],
                                        parent: undefined,
                                        children: []
                                    },
                                    {
                                        type: ProcedureTypes.FOREACH,
                                        args: [ {
                                                    name: 'element', 
                                                    value: 'x'
                                                  },
                                                  {
                                                    name: 'array', 
                                                    value: undefined
                                                  }
                                                ],
                                        parent: undefined,
                                        children: [
                                            {
                                                type: ProcedureTypes.VARIABLE,
                                                args: [ {
                                                            name: 'new_variable', 
                                                            value: 'x'
                                                          },
                                                          {
                                                            name: 'value', 
                                                            value: 10
                                                          }
                                                        ],
                                                parent: undefined,
                                                children: []
                                            },
                                            {
                                                type: ProcedureTypes.VARIABLE,
                                                args: [ {
                                                            name: 'new_variable', 
                                                            value: 'x'
                                                          },
                                                          {
                                                            name: 'value', 
                                                            value: 10
                                                          }
                                                        ],
                                                parent: undefined,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, 
            {
                id: 'sadsdad',
                name: "second_node", 
                position: {x: 0, y: 0}
            }, 
        ]},
    last_updated: new Date(),
    version: 0
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

    }

    return state;
}


