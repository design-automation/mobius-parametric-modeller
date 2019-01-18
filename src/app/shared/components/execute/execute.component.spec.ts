import { DataService } from '../../../shared/services/data.service';

describe('ExecuteComponent test', () => {
    let dataService: DataService;
    // let dataServiceSpy: jasmine.SpyObj<DataService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('dataService', ['getValue']);

        dataService = new DataService();
    });

});

