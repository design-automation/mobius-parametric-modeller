import { DataService } from './data.service';
import { IMobius } from '../models/mobius';
import { IFlowchart, FlowchartUtils } from '../models/flowchart';

describe('ExecuteComponent test', () => {
    let dataService: DataService;

    beforeEach(() => {
        dataService = new DataService();
    });
    it('data service must have an empty flowchart on initialization', () => {
        expect(dataService.file).toBe( <IMobius>{
            name: 'default_file',
            author: 'new_user',
            last_updated: new Date(),
            version: 1,
            flowchart: FlowchartUtils.newflowchart()
        });
    });
});

