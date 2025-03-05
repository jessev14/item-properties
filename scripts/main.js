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
        CONFIG.DND5E.itemProperties[prop] = {
            label: property.name,
            abbreviation: ''
        };
        for (const [itemType, validSet] of Object.entries(CONFIG.DND5E.validProperties)) validSet.add(prop);
    }
});


Hooks.on('renderTidy5eItemSheetClassic', (app, html, appData) => {
    const customItemProperties = game.settings.get(moduleID, 'itemProperties');
    const { item } = app;
    if (item.type === 'weapon') {
        if (html.querySelector('div.unique-properties')) return;

        const weaponPropertiesDiv = html.querySelector('div.weapon-properties');
        const uniquePropertiesDiv = document.createElement('div');
        uniquePropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties', 'unique-properties');
        weaponPropertiesDiv.before(uniquePropertiesDiv);
        uniquePropertiesDiv.innerHTML = '<label>Unique Properties</label>';
        for (const prop of Object.keys(customItemProperties)) {
            const input = weaponPropertiesDiv.querySelector(`input[data-tidy-field="system.properties.${prop}"]`);
            const label = input.parentElement;
            uniquePropertiesDiv.appendChild(label);
        }
    } else if (item.type === 'feat') {
        if (html.querySelector('div.unique-properties')) return;

        const featurePropertiesDiv = html.querySelector('div.feature-properties');
        const uniquePropertiesDiv = document.createElement('div');
        uniquePropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties', 'unique-properties');
        featurePropertiesDiv.before(uniquePropertiesDiv);
        uniquePropertiesDiv.innerHTML = '<label>Unique Properties</label>';
        for (const prop of Object.keys(customItemProperties)) {
            const input = featurePropertiesDiv.querySelector(`input[data-tidy-field="system.properties.${prop}"]`);
            const label = input.parentElement;
            uniquePropertiesDiv.appendChild(label);
        }
    } else if (item.type === 'spell') {
        if (html.querySelector('div.unique-properties')) return;

        const spellComponentsDiv = html.querySelector('div.spell-components');
        const uniquePropertiesDiv = document.createElement('div');
        uniquePropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties', 'unique-properties');
        spellComponentsDiv.before(uniquePropertiesDiv);
        uniquePropertiesDiv.innerHTML = '<label>Unique Properties</label>';
        for (const prop of Object.keys(customItemProperties)) {
            const input = spellComponentsDiv.querySelector(`input[data-tidy-field="system.properties.${prop}"]`);
            const label = input.parentElement;
            uniquePropertiesDiv.appendChild(label);
        }
    } else if (item.type === 'consumable') {
        if (html.querySelector('div.unique-properties')) return;

        const consumableProperties = html.querySelector('div.consumable-properties');
        const uniquePropertiesDiv = document.createElement('div');
        uniquePropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties', 'unique-properties');
        consumableProperties.before(uniquePropertiesDiv);
        uniquePropertiesDiv.innerHTML = '<label>Unique Properties</label>';
        for (const prop of Object.keys(customItemProperties)) {
            const input = consumableProperties.querySelector(`input[data-tidy-field="system.properties.${prop}"]`);
            const label = input.parentElement;
            uniquePropertiesDiv.appendChild(label);
        }
    } else if (item.type === 'equipment') {
        if (html.querySelector('div.unique-properties')) return;

        const equipmentProperties = html.querySelector('div.equipment-properties');
        const uniquePropertiesDiv = document.createElement('div');
        uniquePropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties', 'unique-properties');
        equipmentProperties.before(uniquePropertiesDiv);
        uniquePropertiesDiv.innerHTML = '<label>Unique Properties</label>';
        for (const prop of Object.keys(customItemProperties)) {
            const input = equipmentProperties.querySelector(`input[data-tidy-field="system.properties.${prop}"]`);
            const label = input.parentElement;
            uniquePropertiesDiv.appendChild(label);
        }
    } else if (item.type === 'tool') {
        if (html.querySelector('div.unique-properties')) return;

        const toolProperties = html.querySelector('div.tool-properties');
        const uniquePropertiesDiv = document.createElement('div');
        uniquePropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties', 'unique-properties');
        toolProperties.before(uniquePropertiesDiv);
        uniquePropertiesDiv.innerHTML = '<label>Unique Properties</label>';
        for (const prop of Object.keys(customItemProperties)) {
            const input = toolProperties.querySelector(`input[data-tidy-field="system.properties.${prop}"]`);
            const label = input.parentElement;
            uniquePropertiesDiv.appendChild(label);
        }
    }
});
