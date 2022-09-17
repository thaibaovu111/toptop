export interface ApiBodySchema {
    type: 'object';
    properties: {
        file: {
            type: 'string';
            format: 'binary';
        };
        createdAt: {
            type: 'date';
        };
        updatedAt: {
            type: 'date';
        };
        status: {
            type: 'string';
        };
        template: {
            type: 'string';
        };
        imageUrl: {
            type: 'string';
        };
        transparent: {
            type: 'boolean';
        };
        metadata: {
            type: 'object';
        };
        title: {
            type: 'string';
        };
        campaignId: {
            type: 'string';
        };
        startDate: {
            type: 'date';
        };
        endDate: {
            type: 'date';
        };
        hidden: {
            type: 'boolean';
        };
    };
}
