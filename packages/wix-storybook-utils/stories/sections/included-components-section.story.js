import { header, includedComponents } from '../../src/Sections';


export default {
    category: 'Sections',
    storyName: 'Included Components Section',

    sections: [
        header({
            component: 'Included Components Section',
        }),

        includedComponents({ includedComponents:
                [
                    { category: 'Category', title: 'FirstComponent', optional: true },
                    { category: 'Category', title: 'SecondComponent' },
                ]
        }),
    ],
};
