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

    game.settings.register(moduleID, 'migrationV1.2.0', {
        scope: 'world',
        type: Boolean,
        default: false
    });

    // libWrapper.register(moduleID, 'dnd5e.dataModels.ItemDataModel.prototype.getCardData', newGetCardData, 'WRAPPER');

});

Hooks.once('ready', async () => {
    const customProperties = game.settings.get(moduleID, 'itemProperties');
    for (const [prop, property] of Object.entries(customProperties)) {
        CONFIG.DND5E.itemProperties[prop] = { label: property.name };
        for (const [itemType, validSet] of Object.entries(CONFIG.DND5E.validProperties)) validSet.add(prop);
    }

    if (game.settings.get(moduleID, 'migrationV1.2.0')) return;

    const itemProperties = game.settings.get(moduleID, 'itemProperties');
    const migratedData = {};
    if (Object.entries(itemProperties).length) {
        for (const [k, v] of Object.entries(itemProperties)) {
            migratedData[k] = {
                name: v,
                tooltip: ''
            };
        }
    } else return game.settings.set(moduleID, 'migrationV1.2.0', true);

    await game.settings.set(moduleID, 'itemProperties', migratedData);
    return game.settings.set(moduleID, 'migrationV1.2.0', true);
});



async function newGetCardData(wrapped, enrichmentOptions = {}) {
    const context = await wrapped(enrichmentOptions);;

    lg(context);
    lg(this)

    const item = this.parent;
    const flagData = item.getFlag(moduleID, 'itemProperties');
    const customProperties = game.settings.get(moduleID, 'itemProperties');
    for (const [customProp, checked] of Object.entries(flagData)) {
        if (!checked) continue;

        const propLabel = customProperties[customProp]?.name;
        if (propLabel) context.properties.push(propLabel);
    }

    return context;
}