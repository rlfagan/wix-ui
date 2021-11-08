import { header, includedComponents } from '../../src/Sections';

const includedComponentsArr = [

];

export default {
    category: 'Sections',
    storyName: 'Included Components Section',


    sections: [
        header({
            component: 'Included Components Section',
        }),

        includedComponents(),
        includedComponents(),
        includedComponents(),


    ],
};
