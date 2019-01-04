import { Component } from '@angular/core';
import { QueryParamBuilder, QueryParamGroup, createNumberDeserializer } from '@ngqp/core';

declare const require: Function;

@Component({
    selector: 'demo-empty-on-example',
    templateUrl: './empty-on-example.component.html',
})
export class EmptyOnExampleComponent {

    public paramGroup: QueryParamGroup;

    public markup = require('!raw-loader!./empty-on-example.component.html');
    public typescript = require('!raw-loader!./empty-on-example.component.ts');

    constructor(private qpb: QueryParamBuilder) {
        this.paramGroup = qpb.group({
            number1: qpb.numericParam({
                param: 'n1',
                emptyOn: 20,
            }),
            number2: qpb.numericParam({
                param: 'n2',
                deserialize: createNumberDeserializer(20),
            }),
        });
    }

}