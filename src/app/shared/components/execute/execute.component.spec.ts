/*
import { IFlowchart } from '@models/flowchart';
import {ExecuteComponent } from './execute.component';
import {parse} from 'circular-json';

const testCase1 = '{"language":"js","meta":{"selected_nodes":[0]},"nodes":[{"name":"a_new_node","position":{"x":356,"y":20},"procedure":[{"type":0,"selected":false,"argCount":2,"args":[{"name":"var_name","value":"b"},{"name":"value","value":"a + 6"}]},{"type":8,"selected":false,"meta":{"module":"MATH","name":"add"},"argCount":3,"args":[{"name":"var_name","value":"b"},{"name":"a","value":"2"},{"name":"b","value":"b"}]},{"type":8,"selected":false,"meta":{"module":"MATH","name":"subtract"},"argCount":3,"args":[{"name":"var_name","value":"b"},{"name":"a","value":"20"},{"name":"b","value":"b"}]},{"type":8,"selected":false,"meta":{"module":"MATH","name":"divide"},"argCount":3,"args":[{"name":"var_name","value":"b"},{"name":"a","value":"b"},{"name":"b","value":"2"}]},{"type":8,"selected":false,"meta":{"module":"MATH","name":"multiply"},"argCount":3,"args":[{"name":"var_name","value":"b"},{"name":"a","value":"5"},{"name":"b","value":"b"}]}],"state":{"procedure":{"isTrusted":true,"selected":true}},"inputs":[{"name":"a","default":"2","isConnected":false,"type":0,"meta":{"mode":0}}],"outputs":[{"name":"b","isConnected":false,"type":1,"meta":{"mode":0},"value":""}]}],"edges":[{"source":[0,0],"target":[1,0]}]}';
const testCase2 = '{"language":"js","meta":{"selected_nodes":[0]},"nodes":[{"name":"if-else","position":{"x":162,"y":164},"procedure":[{"type":1,"selected":false,"argCount":1,"args":[{"name":"conditional_statement","value":"cond> 0"}],"children":[{"type":0,"parent":"~flowchart~nodes~0~procedure~0","selected":false,"argCount":2,"args":[{"name":"var_name","value":"result"},{"name":"value","value":"\'positive\'"}]}]},{"type":2,"selected":false,"argCount":1,"args":[{"name":"conditional_statement","value":"cond< 0"}],"children":[{"type":0,"parent":"~flowchart~nodes~0~procedure~1","selected":false,"argCount":2,"args":[{"name":"var_name","value":"result"},{"name":"value","value":"\'negative\'"}]}]},{"type":3,"selected":false,"argCount":0,"args":[],"children":[{"type":0,"parent":"~flowchart~nodes~0~procedure~2","selected":false,"argCount":2,"args":[{"name":"var_name","value":"result"},{"name":"value","value":"\'zero\'"}]}]}],"state":{"procedure":{"isTrusted":true,"selected":true}},"inputs":[{"name":"cond","default":"1","isConnected":false,"type":0,"meta":{"mode":0}}],"outputs":[{"name":"result","isConnected":false,"type":1,"meta":{"mode":0},"value":""}]}],"edges":[{"source":[0,0],"target":[1,0]}]}';

describe('ExecuteComponent test', () => {
    let execute: ExecuteComponent;
    beforeEach(() => { 
        execute = new ExecuteComponent(); 
    });

    it('#execute test 1: simple math test case', () => {
        execute.flowchart = parse(testCase1);
        execute.execute('');
        expect(execute.flowchart.nodes[0].outputs[0].value).toBe(25);
        execute.flowchart.nodes[0].inputs[0].value = 10
        execute.execute('');
        expect(execute.flowchart.nodes[0].outputs[0].value).toBe(5);
    });

    it('#execute test 2: if-elseif-else test case', () => {
        execute.flowchart = parse(testCase2);
        //execute.execute('');
        //expect(execute.flowchart.nodes[0].outputs[0].value).toBe(25);
    });
  
});

*/