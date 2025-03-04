import { ItemPropertiesConfig } from './ItemPropertiesConfig.js';

export const moduleID = 'item-properties';


const lg = x => console.log(x);


Hooks.once('init', () => {
    game.settings.register(moduleID, 'itemProperties', {
        scope: 'world',
        type: Object,
        default: {},
        requiresReload: true
    });

    game.settings.registerMenu(moduleID, 'itemPropertiesConfig', {
        name: 'Item Properties',
        label: 'Customize',
        icon: 'fas fa-cog',
        type: ItemPropertiesConfig,
        restricted: true
    });
});

Hooks.once('ready', async () => {
    const customProperties = game.settings.get(moduleID, 'itemProperties');
    for (const [prop, property] of Object.entries(customProperties)) {
        CONFIG.DND5E.itemProperties[prop] = { label: property.name };
        for (const [itemType, validSet] of Object.entries(CONFIG.DND5E.validProperties)) validSet.add(prop);
    }
});
